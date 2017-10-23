const server = require('../server/index.js');
const request = require('supertest');

describe('server connection test', () => {
  beforeEach(() => {
    server.listen(2244);
  });

  afterEach(() => {
    server.close();
  });
});

describe('/', () => {
  it('should return 200 as response to /', (done) => {
    request('http://localhost:2244')
      .get('/')
      .expect(200, done);
  });


  it('should return 404 for everything else', (done) => {
    request('http://localhost:2244')
      .get('/test')
      .expect(404, done);
  });

  it('should say "Hello world!"', (done) => {
    request('http://localhost:2244')
      .get('/')
      .expect('Hello, world!', done);
  });
});
