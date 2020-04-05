const Mysql = require('node-mysql-helper');

Mysql.connect({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    socketPath: false,
    connectionLimit: 5
});

module.exports = Mysql;