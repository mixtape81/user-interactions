require('../server/environment.js');
const supertest = require('supertest');
const { expect } = require('chai');
const { app } = require('../server/index.js');
const request = supertest.agent(app);
// const { db } = require('../database/index.js');
const random = require('../database/data-generator.js');
const constants = require('../database/data-gen-constants.js');
const { sessions } = require('../database/dummy.js');
const fs = require('fs');
const path = require('path');


// ************SERVER CONNECTION TESTS ************** //

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


// *************** DATABASE QUERY TESTS ********************* //

describe('Execute queries accurately', () => {
  it('should add data to playlist views', (done) => {
    const view = {
      user_id: constants.generateRandomUserId(),
      sessionId: constants.generateRandomSessionId(),
      eventTypeId: 1,
      playlist_id: constants.generateRandomPlaylistId(),
      genre_id: constants.generateRandomGenreId()
    };
    request
      .post('/view')
      .send(view)
      .then((result) => {
        expect(result.body.genre_id).to.equal(view.genre_id);
        expect(result.body.logId).to.exist;
        expect(result.statusCode).to.equal(200);
        done();
      })
      .catch(err => console.log('err in add to playlist views', err));
  });

  it('should add searched terms to search table', (done) => {
    const searched = {
      value: constants.generateRandomSearch(),
      user_id: constants.generateRandomUserId(),
      sessionId: constants.generateRandomSessionId(),
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
      })
      .catch(err => console.log('err in add to search', err));
  });

  it('should add song responses to song responses table', (done) => {
    const response = {
      listenedTo: true,
      song_id: constants.generateRandomSongId(),
      playlist_id: constants.generateRandomPlaylistId(),
      user_id: constants.generateRandomUserId(),
      sessionId: constants.generateRandomSessionId(),
      eventTypeId: 4,
      genre_id: constants.generateRandomGenreId()
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
      })
      .catch(err => console.log('err in add to song responses', err));
  });

  it('should add song reactions to the song reactions table', (done) => {
    const reaction = {
      liked: true,
      song_id: constants.generateRandomSongId(),
      playlist_id: constants.generateRandomPlaylistId(),
      user_id: constants.generateRandomUserId(),
      sessionId: constants.generateRandomSessionId(),
      eventTypeId: 3,
      genre_id: constants.generateRandomGenreId()
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
      })
      .catch(err => console.log('err in add to song reactions', err));
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


// ***************DATA GENERATORS TESTS ********************//

describe('Test mock data functions', () => {
  it('should generate a random sessions', (done) => {
    const sessions = random.generateRandomSessions();
    // expect(constants.sessionId).to.equal(101);
    // expect(sessions.length).to.equal(100);
    expect(sessions[0]).to.have.lengthOf.above(34);
    expect(sessions[0]).to.be.a('string');
    done();
  });

  it('should increment constant sessionId variable', (done) => {
    const sessions = random.generateRandomSessions();
    // expect(constants.sessionId).to.equal(201);
    // expect(sessions.length).to.equal(100);
    expect(sessions[0]).to.have.lengthOf.above(34);
    expect(sessions[0]).to.be.a('string');
    done();
  });

  it('should generate a random end time', (done) => {
    const endTime = random.generateRandomEndTime();
    expect(endTime).to.be.a('number');
    done();
  });

  it('should read and write sessions to text file', (done) => {
    random.archiveSessions(sessions);
    fs.readFile(path.join(__dirname, '../database/sessions.txt'), (err, data) => {
      if (err) {
        console.log('error while reading file', err);
      } else {
        const contents = data.toString().split(',');
        expect(contents).length.to.not.equal(0);
        expect(contents[0]).to.be.a('string');
        done();
      }
    });
  });

  it('should genereate a random event', (done) => {
    const event = constants.generateRandomEvent();
    expect(event).to.be.a('number');
    done();
  });

  it('should add a view to database', (done) => {
    random.triggerPlaylistView(sessions[20].split('--'))
      .then((view) => {
        expect(view.logId).to.exist;
        expect(view.id).to.exist;
        done();
      });
  });

  it('should add a search event to database', (done) => {
    random.triggerSearch(sessions[8].split('--'))
      .then((searched) => {
        expect(searched.logId).to.exist;
        expect(searched.id).to.exist;
        done();
      });
  });

  it('should generate a boolen', (done) => {
    const bool = constants.generateBoolean();
    expect(bool).to.be.a('boolean');
    done();
  });

  it('should add a song reaction to database', (done) => {
    random.triggerSongReaction(sessions[10].split('--'))
      .then((songReaction) => {
        console.log('log id', songReaction.logId);
        expect(songReaction.logId).to.exist;
        expect(songReaction.id).to.exist;
        done();
      });
  });

  it('should add a song reaction to database', (done) => {
    random.triggerSongReaction(sessions[5].split('--'))
      .then((songResponse) => {
        console.log('log id', songResponse.logId);
        expect(songResponse.logId).to.exist;
        expect(songResponse.id).to.exist;
        done();
      });
  });

  it('archieveSessions should rewrite whole file', (done) => {
    random.archiveSessions('');
    const batch1 = sessions.slice(0, 4);
    const batch2 = sessions.slice(4, 8);
    random.archiveSessions(batch1);
    // console.log('batch2', batch2);
    random.archiveSessions(batch2);
    // turn into promise
    fs.readFile(path.join(__dirname, '../database/sessions.txt'), (err, data) => {
      if (err) {
        console.log('err getting sessions for archive sessions', err);
      } else {
        const retrieved = data.toString().split(',');
        console.log('retrieved', retrieved);
        expect(retrieved).to.deep.equal(batch2);
        done();
      }
    });
  });
});
