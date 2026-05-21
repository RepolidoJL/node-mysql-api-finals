import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';
import accountModel from '../accounts/account.model';
import refreshTokenModel from '../accounts/refresh-token.model';
const config = require('../config.json');

const db: any = {};
export default db;
initialize();

async function initialize() {
    const host = process.env.DB_HOST || config.database.host || 'localhost';
    const port = parseInt(process.env.DB_PORT || config.database.port || '3306');
    const user = process.env.DB_USER || config.database.user || 'root';
    const password = process.env.DB_PASSWORD || config.database.password || '';
    const database = process.env.DB_NAME || config.database.database || 'node_mysql_api';

    // Create database if it doesn't exist (use a raw connection, then close it)
    const rawConn = await mysql.createConnection({ host, port, user, password });
    await rawConn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await rawConn.end();

    const sequelize = new Sequelize(database, user, password, {
        host: host,
        port: port,
        dialect: 'mysql',
        dialectModule: require('mysql2'),
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            freezeTableName: true,
            timestamps: false
        },
        logging: false,
        benchmark: false
    });

    db.Account = accountModel(sequelize);
    db.RefreshToken = refreshTokenModel(sequelize);

    db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
    db.RefreshToken.belongsTo(db.Account);

    // Sync with timeout
    await sequelize.sync();
    console.log('Database sync completed successfully');
}