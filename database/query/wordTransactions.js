const MyDB = require('../mysqlConnector');

module.exports.Query = function(query, values) {
    return new Promise(resolve => {
        MyDB.query(query, values)
            .then(function(results) {
                resolve(results);
            })
            .catch(function(err) {
                reject(err);
            });
    });
};