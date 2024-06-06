import mysql from 'mysql2';
import config from './config';

const pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
}).promise();

export default pool;
