const bcrypt = require('bcrypt');
const fs = require('fs').promises;
const path = require('path');
const jwt = require('jsonwebtoken');
const { User } = require('../entities/user'); 
const { Client } = require('../entities/client'); 
const { dataSource } = require('../dbConnection');
const { JWT_EXPIRATION } = require('../constants.json');

class AuthService {
    static async register(userData, clientData) {
        const repositoryUser = dataSource.getRepository(User);
        const repositoryClient = dataSource.getRepository(Client);
        
        userData.password = await bcrypt.hash(userData.password, 12);        
        const user = repositoryUser.create(userData);
        await repositoryUser.save(user);

        const createdUser = await repositoryUser.findOneBy({ id: user.id });
        
        clientData.photos = clientData.photos.map((photo) => photo.fileName);
        const client  = repositoryClient.create({ ...clientData, user: createdUser });
        await repositoryClient.save(client);
    }

    static async generateToken(email) {
       return jwt.sign({ email }, process.env.SECRET_TOKEN, { expiresIn: JWT_EXPIRATION });
    }

    static async getUserByEmail(email) {
        const repositoryUser = dataSource.getRepository(User);
        return repositoryUser.createQueryBuilder('user')
                                .addSelect('user.password')
                                .where('user.email = :email', { email })
                                .getOne();
    }

    static async getClientByEmail(email) {
        const repositoryClient = dataSource.getRepository(Client);
        return repositoryClient.createQueryBuilder('client')
                                .innerJoinAndSelect('client.user', 'user')
                                .where('user.email = :email', { email })
                                .getOne();
    }

    static comparePasswords(password, dbPassword) {
        return bcrypt.compare(password, dbPassword)
    }

    static async upload(base64Array) {
        const promises = base64Array.map(async({ base64, fileName}) => {
            await fs.writeFile(path.join(__dirname, '../assets/uploads', fileName), Buffer.from(base64, 'base64'));
            return true;
        });
        return Promise.all(promises);
    }
}

module.exports = AuthService;