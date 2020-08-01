const transactions = require('./transactions');

class TransactinonFactory {
  constructor() { }

  static create(provider, args) {
    let transaction = transactions[provider];
    if (!transaction)
      throw new Error('Database transaction is not found. Database transaction provider: ' + provider);
    return new transaction(args);
  }
}

module.exports = TransactinonFactory;