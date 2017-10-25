const dotenv = require('dotenv');

const environment = process.env.NODE_ENV;
const ENV_PATH = environment ? `.env.${environment}` : '.env.development';
dotenv.config({ path: ENV_PATH });

console.log('I was here and defined environment', ENV_PATH);

module.exports = {
  ENV_PATH
};
