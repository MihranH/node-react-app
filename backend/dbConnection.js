const typeorm = require('typeorm');
const Logger = require('./services/Logger');
const { DEV } = require('./constants.json');
const { DB_TYPE, DB_HOST, DB_PORT, DB_NAME, NODE_ENV } = process.env;

const dataSource = new typeorm.DataSource(({
    type: DB_TYPE || 'postgres',
    host: DB_HOST || 'localhost',
    port: DB_PORT || 5432,
    database: DB_NAME || 'node-react-app',
    synchronize: NODE_ENV === DEV,
    entities: ['entities/**/*.ts'],
    migrations: [],
    subscribers: [],
    // logging: NODE_ENV === DEV
}));

dataSource.initialize().then(() => {
    Logger.info('Connected to DB');
}).catch((err) => {
    Logger.error(`Error on connecting to DB:`, err);
});

module.exports = {
    dataSource
}