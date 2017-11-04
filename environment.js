// this file defines the environment variables
const dotenv = require('dotenv');

const environment = process.env.NODE_ENV;
const ENV_PATH = environment ? `.env.${environment}` : '.env.production';
dotenv.config({ path: ENV_PATH });

module.exports = {
  ENV_PATH
};
