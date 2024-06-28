const bcrypt = require('bcrypt');
const path = require('path');
const jwt = require('jsonwebtoken');
const { User } = require('../entities/user');
const { Client, UserClientView } = require('../entities/client');
const { dataSource } = require('../dbConnection');
const { JWT_EXPIRATION, UPLOAD_PATH } = require('../constants.json');
const { getContentDisposition } = require('../helpers');
const fsPromises = require('fs/promises');

class AuthService {
  static async register(userData, clientData) {
    const repositoryUser = dataSource.getRepository(User);
    const repositoryClient = dataSource.getRepository(Client);

    userData.password = await bcrypt.hash(userData.password, 12);
    const user = repositoryUser.create(userData);
    await repositoryUser.save(user);

    const createdUser = await repositoryUser.findOneBy({ id: user.id });

    const client = repositoryClient.create({
      ...clientData,
      user: createdUser,
    });
    await repositoryClient.save(client);

    return {
      userId: user.id,
      userEmail: user.email,
    };
  }

  static async generateToken(email) {
    return jwt.sign({ email }, process.env.SECRET_TOKEN, {
      expiresIn: JWT_EXPIRATION,
    });
  }

  static async getUserByEmail(email) {
    const repositoryUser = dataSource.getRepository(User);
    return repositoryUser
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  static async getUserById(id) {
    const repositoryUser = dataSource.getRepository(User);
    return repositoryUser
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
  }

  static async deleteUserById(id, fileNames = []) {
    await dataSource
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('id = :id', { id })
      .execute();
    const promises = fileNames.map(async (fileName) => {
      return fsPromises.unlink(
        path.join(__dirname, `../assets/uploads/${id}/${fileName}`),
      );
    });
    await Promise.all(promises);

    return true;
  }

  static async getClientByEmail(email) {
    const repositoryClient = dataSource.getRepository(Client);
    const repositoryUserClientView = dataSource.getRepository(UserClientView);

    const client = await repositoryClient
      .createQueryBuilder('client')
      .innerJoinAndSelect('client.user', 'user')
      .where('user.email = :email', { email })
      .getOne();
    if (!client) {
      return null;
    }
    const viewInfo = await repositoryUserClientView.findOneBy({
      userId: client?.user?.id,
    });
    return {
      ...client,
      ...viewInfo,
      imagePath: `${UPLOAD_PATH}/${client?.user?.id}`,
    };
  }

  static comparePasswords(password, dbPassword) {
    return bcrypt.compare(password, dbPassword);
  }

  static async uploadBase64(base64Array) {
    const promises = base64Array.map(async ({ base64, fileName }) => {
      await fsPromises.writeFile(
        path.join(__dirname, '../assets/uploads', fileName),
        Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ''), 'base64'),
      );
      return true;
    });
    return Promise.all(promises);
  }

  static async upload(part, userId, index) {
    let fileName;
    const headerEndIndex = part.indexOf('\r\n\r\n');
    if (headerEndIndex === -1) return;

    const headersString = part.slice(0, headerEndIndex).toString();
    const contentDisposition = getContentDisposition(headersString);

    if (contentDisposition?.includes('form-data; name="file"; filename=')) {
      fileName = contentDisposition.match(/filename="(.+?)"/)?.[1];
      fileName = `${index}_${fileName}`;

      const start = headerEndIndex + 4; // Skip \r\n\r\n
      const end = part.length - 2; // Exclude \r\n
      const fileData = part.slice(start, end);

      const filePath = path.join(
        __dirname,
        `../assets/uploads/${userId}/${fileName}`,
      );

      await fsPromises.writeFile(filePath, fileData);
    }

    return fileName;
  }

  static async createUserFolder(userId) {
    return fsPromises.mkdir(
      path.join(__dirname, `../assets/uploads/${userId}`),
      { recursive: true },
    );
  }

  static async updateClientPhotos(userId, photos) {
    return dataSource
      .createQueryBuilder()
      .update(Client)
      .set({ photos })
      .where('userId = :userId', { userId })
      .execute();
  }
}

module.exports = AuthService;
