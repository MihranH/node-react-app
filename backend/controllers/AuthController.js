const { validationResult } = require('express-validator');
const AuthService = require('../services/AuthService');
const Logger = require('../services/Logger');
const { DEFAULT_AVATAR } = require('../constants');

class AuthController {
    static async register(req, res) {
        try {
            const { firstName, lastName, email, password, role, photos } = req.body;

            const { errors } = validationResult(req);
            if (errors.length) {
                return res.status(400).send({ message: `${errors.map((err) => err.msg).join(', ')}` });
            }
            const passwordRegexp = new RegExp(/.*[0-9].*/)
            if (!passwordRegexp.test(password)) {
                return res.status(400).send({ message: 'Password should contain at least one number' });
            }

            const emailExists = await AuthService.getUserByEmail(email);
            if (emailExists) {
                return res.status(400).send({ message: `Email ${email} already exists` });
            }

            await AuthService.register({ firstName, lastName, email, password, role }, { avatar: DEFAULT_AVATAR, photos });

            try {
                await AuthService.upload(photos);
            } catch (error) {
                return res.status(400).send({ message: 'Client is registered but photo upload failed' });
            }

            return res.send({ message: 'Client registered successfully' });
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
                return res.status(404).send({ message: `User with email ${email} not found` });
            }

            const passwordIsCorrect = await AuthService.comparePasswords(password, user.password);
            if (!passwordIsCorrect) {
                return res.status(400).send({message: 'Invalid password'});
            }

            const token = await AuthService.generateToken(email);

            return res.send({ token });
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
                return res.status(401).send({message: 'Unauthorized'});
            }

            return res.send(clientUser);
        } catch (error) {
            Logger.error(error);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }
}

module.exports = AuthController;
