const Mysql = require('node-mysql-helper');

const config = {
    host: "localhost",
    user: "root",
    password: "ismet",
    database: "turkish_words",
    socketPath: false,
    connectionLimit: 5
};

Mysql.connect(config);

module.exports = Mysql;