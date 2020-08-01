const mysqlDataContext = require('../dataContext/mysqlDataContext')

class QueryTransaction {
    constructor() { }

    queryAsync() {
        return new Promise(resolve => {
            mysqlDataContext.query(query, (error, result) => {
                if (!error) {
                    if (result != null) {
                        resolve(result);
                    }
                    else {
                        resolve({ status: 404, message: 'Not found word !' });
                    }
                }
                else {
                    console.log(error.message)
                    reject({ status: 500, message: error.message });
                }
            });
        });
    };
}

module.exports = QueryTransaction;