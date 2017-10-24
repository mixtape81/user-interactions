// const Sequelize = require('sequelize');
// const server = require('../server');
// const supertest = require('supertest');
// const request = supertest.agent(server);
// const { expect } = require('chai');
const test = require('./tests.js');

describe('Database testing', () => {
  let db;
  const config = {
    database: 'mixtape',
    username: 'mixtape',
    password: 'mixtape',
    dialect: 'postgres'
};

  beforeEach(() => {
    db = test.Sequelize(config);
    db.authenticate()
      .then(() => console.log('in test for db'))
      .catch(err => console.log('error connecting to DBin test', err));
  });

  afterEach(() => {
    process.exit();
  });
});

describe('testing once', () => {
  it('should console log', () => {
    console.log('connected to database for testing');
  });
});
