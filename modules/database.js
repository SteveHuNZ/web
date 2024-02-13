const mariadb = require("mariadb");

const USER_NAME = process.env.DB_USER;//  'qh55';
const USER_PASS = process.env.DB_PASS;// '1535898';

const database = mariadb.createConnection({
    host: process.env.DB_URL, //'db.trex-sandwich.com',
    database: USER_NAME,
    user: USER_NAME,
    password: USER_PASS
});

module.exports = database;
