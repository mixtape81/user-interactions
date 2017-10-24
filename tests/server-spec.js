const test = require('./tests.js');

describe('server connection test', () => {
  beforeEach(() => {
    test.server.listen(2244);
  });

  afterEach(() => {
    test.server.close();
  });
});

describe('/', () => {
  it('should return 200 as response to /', (done) => {
    test.supertest('http://localhost:2244')
      .get('/')
      .expect(200, done);
  });


  it('should return 404 for everything else', (done) => {
    test.supertest('http://localhost:2244')
      .get('/test')
      .expect(404, done);
  });

  it('should say "Hello world!"', (done) => {
    test.supertest('http://localhost:2244')
      .get('/')
      .expect('Hello, world!', done);
  });
});
