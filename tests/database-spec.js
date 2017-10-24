// const Sequelize = require('sequelize');
// const server = require('../server');
// const supertest = require('supertest');
// const request = supertest.agent(server);
// const { expect } = require('chai');
const environment = process.env.NODE_ENV;
let config;
if (environment) {
  const envPath = `.env.${environment}`;
  const env_Vars = require('dotenv').config({ path: envPath });
  config = {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: 'postgres'
  };
} else {
  config = {
    database: 'travis_ci_test',
    username: 'postgres',
    password: '',
    dialect: 'postgres'
  };
}

const test = require('./tests.js');

describe('Database testing', () => {
  let db;
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
