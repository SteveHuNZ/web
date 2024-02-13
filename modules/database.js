const mariadb = require("mariadb");

const USER_NAME = 'qh55';
const USER_PASS = '1535898';

const database = mariadb.createConnection({
    host: 'db.trex-sandwich.com',
    database: USER_NAME,
    user: USER_NAME,
    password: USER_PASS
});

module.exports = database;
