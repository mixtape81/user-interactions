const environment = process.env.NODE_ENV;
const envPath = `.env.${environment}`;
const env_Vars = require('dotenv').config({ path: envPath });
const test = require('./tests.js');

describe('server connection test', () => {
  beforeEach(() => {
    test.server.listen(process.env.PORT);
  });

  afterEach(() => {
    test.server.close();
  });
});

describe('/', () => {
  it('should return 200 as response to /', (done) => {
    test.supertest(process.env.HOSTNAME)
      .get('/')
      .expect(200, done);
  });


  it('should return 404 for everything else', (done) => {
    test.supertest(process.env.HOSTNAME)
      .get('/test')
      .expect(404, done);
  });

  it('should say "Hello world!"', (done) => {
    test.supertest(process.env.HOSTNAME)
      .get('/')
      .expect('Hello, world!', done);
  });
});
