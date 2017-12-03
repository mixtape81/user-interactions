const { client } = require('./');

const addDocumentsInBulk = (index, type, body) => client.bulk({ index, type, body });

module.exports = {
  addDocumentsInBulk
};

