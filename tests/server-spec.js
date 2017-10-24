const environment = process.env.NODE_ENV;
const test = require('./tests.js');

if (environment) {
  const envPath = `.env.${environment}`;
  const env_Vars = require('dotenv').config({ path: envPath });
}

const host = process.env.HOSTNAME || 'localhost';
const port = process.env.PORT || 2000;

describe('server connection test', () => {
  beforeEach(() => {
    test.server.listen(port);
  });

  afterEach(() => {
    test.server.close();
  });
});

describe('/', () => {
  it('should return 200 as response to /', (done) => {
    test.supertest(host)
      .get('/')
      .expect(200, done);
  });


  it('should return 404 for everything else', (done) => {
    test.supertest(host)
      .get('/test')
      .expect(404, done);
  });

  it('should say "Hello world!"', (done) => {
    test.supertest(host)
      .get('/')
      .expect('Hello, world!', done);
  });
});
