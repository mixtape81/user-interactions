const env = require('../server/environment.js');
const supertest = require('supertest');
const { expect } = require('chai');

const { app } = require('../server/index.js');
const request = supertest.agent(app);
const { db } = require('../database/index.js');
const random = require('../database/data-generator.js');

describe('server connection test', () => {
  beforeEach(() => {
    const server = app.listen(process.env.PORT);
    afterEach(() => {
      server.close();
    });
  });
});

describe('/', () => {
  it('should return 200 as response to /', (done) => {
    request
      .get('/')
      .expect(200, done);
  });


  it('should return 404 for everything else', (done) => {
    request
      .get('/test')
      .expect(404, done);
  });

  it('should say "Hello world!"', (done) => {
    request
      .get('/')
      .expect('Hello, world!', done);
  });
});

describe('Execute queries accurately', () => {
  it('should add data to playlist views', (done) => {
    const view = {
      user_id: random.generateRandomUserId(),
      sessionId: random.generateRandomSession(),
      eventTypeId: 1,
      playlist_id: random.generateRandomPlaylistId(),
      genre_id: random.generateRandomGenreId()
    };
    request
      .post('/view')
      .send(view)
      .then((result) => {
        expect(result.body.genre_id).to.equal(view.genre_id);
        expect(result.body.logId).to.exist;
        expect(result.statusCode).to.equal(200);
        done();
      });
  });

  it('should add searched terms to search table', (done) => {
    const searched = {
      value: random.generateRandomSearch(),
      user_id: random.generateRandomUserId(),
      sessionId: random.generateRandomSession(),
      eventTypeId: 1
    };
    request
      .post('/search')
      .send(searched)
      .then((result) => {
        expect(result.body.value).to.equal(searched.value);
        expect(result.body.logId).to.exist;
        expect(result.statusCode).to.equal(200);
        done();
      });
  });

  it('should add song responses to song responses table', (done) => {
    const response = {
      listenedTo: true,
      song_id: random.generateRandomSongId(),
      playlist_id: random.generateRandomPlaylistId(),
      user_id: random.generateRandomUserId(),
      sessionId: random.generateRandomSession(),
      eventTypeId: 4,
      genre_id: random.generateRandomGenreId()
    };
    request
      .post('/songresponse')
      .send(response)
      .then((result) => {
        expect(result.body.song_id).to.equal(response.song_id);
        expect(result.body.playlist_id).to.equal(response.playlist_id);
        expect(result.body.logId).to.exist;
        expect(result.statusCode).to.equal(200);
        done();
      });
  });

  it('should add song reactions to the song reactions table', (done) => {
    const reaction = {
      liked: true,
      song_id: random.generateRandomSongId(),
      playlist_id: random.generateRandomPlaylistId(),
      user_id: random.generateRandomUserId(),
      sessionId: random.generateRandomSession(),
      eventTypeId: 3,
      genre_id: random.generateRandomGenreId()
    };
    request
      .post('/songreaction')
      .send(reaction)
      .then((result) => {
        expect(result.body.song_id).to.equal(reaction.song_id);
        expect(result.body.playlist_id).to.equal(reaction.playlist_id);
        expect(result.body.logId).to.exist;
        expect(result.statusCode).to.equal(200);
        done();
      });
  });
});
