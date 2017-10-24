const config = {
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'mixtape',
    password: 'mixtape',
    database: 'mixtape',
    charset: 'ut8'
  },
  debug: true
};

const knex = require('knex')(config);
const bookshelf = require('bookshelf')(knex);

module.exports = {
  knex,
  bookshelf
};
