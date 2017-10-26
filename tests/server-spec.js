require('../server/environment.js');
const supertest = require('supertest');
const random = require('../database/data-generator.js');
const { expect } = require('chai');
const { app } = require('../server/index.js').app;

const request = supertest.agent(app);
// const { db } = require('../database/index.js');

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

  it('should get all playlist views for a given day', (done) => {
    const time = new Date();
    const date = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`;
    request
      .get(`/playlistviews?date=${date}`)
      .then((result) => {
        expect(result.body.length).to.not.equal(0);
        expect(result.statusCode).to.equal(200);
        done();
      })
      .catch(err => console.log('err in test for GET views', err));
  });

  it('should not return any playlists if date does not match', (done) => {
    request
      .get('/playlistviews?date=2010-10-25')
      .then((result) => {
        expect(result.body.length).to.equal(0);
        expect(result.statusCode).to.equal(200);
        done();
      })
      .catch(err => console.log('err in test for GET views (emtpty)', err));
  });

  it('should get all song responses views for a given day', (done) => {
    const time = new Date();
    const date = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`;
    request
      .get(`/songresponses?date=${date}`)
      .then((result) => {
        expect(result.body.length).to.not.equal(0);
        expect(result.statusCode).to.equal(200);
        done();
      })
      .catch(err => console.log('err in test for GET song responses', err));
  });

  it('should not return any song responses if date does not match', (done) => {
    request
      .get('/songresponses?date=2010-10-25')
      .then((result) => {
        expect(result.body.length).to.equal(0);
        expect(result.statusCode).to.equal(200);
        done();
      })
      .catch(err => console.log('err in test for GET song responses (empty)', err));
  });

  it('should get all song reactions views for a given day', (done) => {
    const time = new Date();
    const date = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`;
    request
      .get(`/songreactions?date=${date}`)
      .then((result) => {
        expect(result.body.length).to.not.equal(0);
        expect(result.statusCode).to.equal(200);
        done();
      })
      .catch(err => console.log('err in test for GET song reactions', err));
  });

  it('should not return any song reactions if date does not match', (done) => {
    request
      .get('/songreactions?date=2010-10-25')
      .then((result) => {
        expect(result.body.length).to.equal(0);
        expect(result.statusCode).to.equal(200);
        done();
      })
      .catch(err => console.log('err in test for GET song reactions (empty)', err));
  });
});
