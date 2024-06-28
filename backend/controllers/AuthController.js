const { validationResult } = require('express-validator');
const AuthService = require('../services/AuthService');
const Logger = require('../services/Logger');
const { DEFAULT_AVATAR, ROLE } = require('../constants.json');
const { extractBufferData } = require('../helpers');

class AuthController {
  static async register(req, res) {
    try {
      const { firstName, lastName, email, password } = req.body;
      const { errors } = validationResult(req);
      if (errors.length) {
        return res.status(400).send({
          message: `${errors.map((err) => err.msg).join(', ')}`,
        });
      }
      const passwordRegexp = new RegExp(/.*[0-9].*/);
      if (!passwordRegexp.test(password)) {
        return res.status(400).send({
          message: 'Password should contain at least one number',
        });
      }

      const emailExists = await AuthService.getUserByEmail(email);
      if (emailExists) {
        return res
          .status(400)
          .send({ message: `Email ${email} already exists` });
      }

      const result = await AuthService.register(
        { firstName, lastName, email, password, role: ROLE },
        { avatar: DEFAULT_AVATAR },
      );

      return res.send({
        email: result.email,
        userId: result.userId,
        message: 'Client registered successfully',
      });
    } catch (error) {
      Logger.error(error);
      return res.status(500).send({ message: 'Something went wrong' });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await AuthService.getUserByEmail(email);
      if (!user) {
        return res
          .status(404)
          .send({ message: `User with email ${email} not found` });
      }

      const passwordIsCorrect = await AuthService.comparePasswords(
        password,
        user.password,
      );
      if (!passwordIsCorrect) {
        return res.status(400).send({ message: 'Invalid password' });
      }

      const token = await AuthService.generateToken(email);
      const clientUser = await AuthService.getClientByEmail(email);

      return res.send({ token, clientUser });
    } catch (error) {
      Logger.error(error);
      return res.status(500).send({ message: 'Something went wrong' });
    }
  }

  static async getUserInfo(req, res) {
    try {
      const { userEmail } = req.session;
      const clientUser = await AuthService.getClientByEmail(userEmail);
      if (!clientUser) {
        return res.status(401).send({ message: 'Unauthorized' });
      }

      return res.send(clientUser);
    } catch (error) {
      Logger.error(error);
      return res.status(500).send({ message: 'Something went wrong' });
    }
  }

  static async uploadFiles(req, res) {
    const { userId } = req.query;
    try {
      if (!userId) {
        return res.status(400).send({ message: 'Please provide the user' });
      }
      const user = await AuthService.getUserById(userId);
      if (!user) {
        return res
          .status(404)
          .send({ message: `User with id ${userId} not found` });
      }

      const data = [];
      const contentType = req.headers['content-type'];
      const boundary = contentType?.split('=')?.[1];

      if (!boundary) {
        return res.status(400).send({ message: 'No files uploaded' });
      }

      req.on('data', (chunk) => {
        data.push(chunk);
      });

      req.on('end', async () => {
        const fileNames = [];
        try {
          const parts = extractBufferData(Buffer.concat(data), boundary);
          await AuthService.createUserFolder(userId);

          for (const index in parts) {
            const part = parts[index];
            const fileName = await AuthService.upload(part, userId, index);
            if (fileName) {
              fileNames.push(fileName);
            }
          }
          await AuthService.updateClientPhotos(userId, fileNames);
          return res.send({ message: 'Files uploaded successfully' });
        } catch (error) {
          Logger.error(error);
          await AuthService.deleteUserById(userId, fileNames);
          return res.status(400).send({ message: 'File upload failed' });
        }
      });

      req.on('error', async (err) => {
        Logger.error(err);
        await AuthService.deleteUserById(userId);
        return res.status(400).send({ message: 'File upload failed' });
      });
    } catch (error) {
      Logger.error(error);
      await AuthService.deleteUserById(userId);
      return res.status(500).send({ message: 'Something went wrong' });
    }
  }
}

module.exports = AuthController;
