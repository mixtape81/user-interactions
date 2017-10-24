const Sequelize = require('sequelize');
const supertest = require('supertest');
const { expect } = require('chai');
const server = require('../server/index.js');
const request = supertest.agent(server);

module.exports = {
  Sequelize,
  server,
  supertest,
  request,
  expect
};
