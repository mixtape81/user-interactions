const knex = require('knex');
const bookshelf = require('bookshelf');
const request = require('supertest');
const { expect } = require('chai');

describe('Dtabase testing', () => {
  const config = {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'mixtape',
      password: 'mixtape',
      database: 'mixtape',
      charset: 'ut8'
    }
  };

  beforeEach(() => {
    knex(config);
    bookshelf(knex);
  });

  afterEach(() => {
    process.exit();
  });
});
