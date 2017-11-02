/* eslint-env mocha */

require('../environment.js');
const supertest = require('supertest');
const { expect } = require('chai');
const { app } = require('../server/index.js');
const request = supertest.agent(app);
const elasticsearch = require('../elasticsearch/queries.js');
// const { db } = require('../database/index.js');
const random = require('../data-generation/data-generator.js');
const constants = require('../data-generation/data-helpers.js');
const { sessions } = require('./dummy-sessions.js');
const fs = require('fs');
const path = require('path');
const AWS = require('../server-aws/index.js');
const AWSQueries = require('../server-aws/aws-queries.js');


// ************SERVER CONNECTION TESTS ************** //

xdescribe('server connection test', () => {
  beforeEach(() => {
    const server = app.listen(process.env.PORT);
    afterEach(() => {
      server.close();
    });
  });
});

xdescribe('/', () => {
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

xdescribe('Execute queries accurately', () => {
  it('should add data to playlist views', (done) => {
    const session = sessions[2].split('--');
    const view = {
      user_id: constants.generateRandomUserId(),
      sessionId: Number(session[0]),
      eventTypeId: 1,
      playlist_id: constants.generateRandomPlaylistId(),
      genre_id: constants.generateRandomGenreId(),
      createdAt: new Date(Number(session[2])).toUTCString()
    };
    request
      .post('/view')
      .send(view)
      .then((result) => {
        expect(result.body.genre_id).to.equal(view.genre_id);
        expect(result.body.logId).to.not.equal(undefined);
        expect(result.statusCode).to.equal(200);
        done();
      })
      .catch(err => console.log('err in add to playlist views', err));
  });

  it('should add searched terms to search table', (done) => {
    const session = sessions[2].split('--');
    const searched = {
      value: constants.generateRandomSearch(),
      user_id: constants.generateRandomUserId(),
      sessionId: Number(session[0]),
      eventTypeId: 1,
      createdAt: new Date(Number(session[2])).toUTCString()
    };
    console.log('timestamp', searched.createdAt);
    request
      .post('/search')
      .send(searched)
      .then((result) => {
        expect(result.body.value).to.equal(searched.value);
        expect(result.body.logId).to.not.equal(undefined);
        expect(result.statusCode).to.equal(200);
        done();
      })
      .catch(err => console.log('err in add to search', err));
  });

  it('should add song responses to song responses table', (done) => {
    const session = sessions[2].split('--');
    const response = {
      listenedTo: true,
      song_id: constants.generateRandomSongId(),
      playlist_id: constants.generateRandomPlaylistId(),
      user_id: constants.generateRandomUserId(),
      sessionId: Number(session[0]),
      eventTypeId: 4,
      genre_id: constants.generateRandomGenreId(),
      createdAt: new Date(Number(session[2])).toUTCString()
    };
    request
      .post('/songresponse')
      .send(response)
      .then((result) => {
        expect(result.body.song_id).to.equal(response.song_id);
        expect(result.body.playlist_id).to.equal(response.playlist_id);
        expect(result.body.logId).to.not.equal(undefined);
        expect(result.statusCode).to.equal(200);
        done();
      })
      .catch(err => console.log('err in add to song responses', err));
  });

  it('should add song reactions to the song reactions table', (done) => {
    const session = sessions[2].split('--');
    const reaction = {
      liked: true,
      song_id: constants.generateRandomSongId(),
      playlist_id: constants.generateRandomPlaylistId(),
      user_id: constants.generateRandomUserId(),
      sessionId: Number(session[0]),
      eventTypeId: 3,
      genre_id: constants.generateRandomGenreId(),
      createdAt: new Date(Number(session[2])).toUTCString()
    };
    request
      .post('/songreaction')
      .send(reaction)
      .then((result) => {
        expect(result.body.song_id).to.equal(reaction.song_id);
        expect(result.body.playlist_id).to.equal(reaction.playlist_id);
        expect(result.body.logId).to.not.equal(undefined);
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


// ***************DATA GENERATOR TESTS ********************//

xdescribe('Test mock data functions', () => {
  it('should generate a random sessions', (done) => {
    const time = {
      timeStamp: Date.now(),
      sessionId: 10
    };
    const sessions = random.generateRandomSessions(time);
    // expect(constants.sessionId).to.equal(101);
    // expect(sessions.length).to.equal(100);
    expect(sessions[0]).to.have.lengthOf.above(34);
    expect(sessions[0]).to.be.a('string');
    done();
  });

  it('should increment constant sessionId variable', (done) => {
    const time = {
      timeStamp: Date.now(),
      sessionId: 15
    };
    const sessions = random.generateRandomSessions(time);
    const session1 = Number(sessions[0].split('--')[0]);
    const session2 = Number(sessions[1].split('--')[0]);
    // expect(constants.sessionId).to.equal(201);
    // expect(sessions.length).to.equal(100);
    expect(sessions[0]).to.have.lengthOf.above(34);
    expect(sessions[0]).to.have.lengthOf.above(34);
    expect(sessions[0]).to.be.a('string');
    expect(session2 - session1).to.be.equal(1);
    done();
  });

  it('should generate a random end time', (done) => {
    const endTime = random.generateRandomEndTime();
    expect(endTime).to.be.a('number');
    done();
  });

  it('should read and write sessions to text file', (done) => {
    random.archiveSessions(sessions, '../tests/sessions-test.txt');
    fs.readFile(path.join(__dirname, './sessions-test.txt'), (err, data) => {
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
        expect(songReaction.logId).to.exist;
        expect(songReaction.id).to.exist;
        done();
      });
  });

  it('should add a song reaction to database', (done) => {
    random.triggerSongReaction(sessions[5].split('--'))
      .then((songResponse) => {
        expect(songResponse.logId).to.exist;
        expect(songResponse.id).to.exist;
        done();
      });
  });

  it('archieveSessions should rewrite whole file', (done) => {
    const testFile = '../tests/sessions-test.txt';
    const batch1 = sessions.slice(0, 4);
    const batch2 = sessions.slice(4, 8);
    random.archiveSessions(batch1, testFile);
    console.log('batch2', batch2);
    random.archiveSessions(batch2, testFile);
    // turn into promise
    fs.readFile(path.join(__dirname, './sessions-test.txt'), (err, data) => {
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

    // ************************* TESTS FOR ELASTIC SEARCG ******************************* //

  xdescribe('Tests for elasticsearch', () => {
    //add tests for elastic search
    it('should create an index', (done) => {

    });

    it('should delete an index', (done) => {

    });

    it('should add a document to an index', (done) => {

    });

    it('should add documents in bulk to an index', (done) => {

    });

    it ('should retreieve documents from an index', (done) => {

    });
  })

  // ********************************** AWS SQS TESTS ************************************** //

describe('AWS SQS Tests', () => {
  let messageToDelete;
  it('shoud connect to AWS and return list of queues', (done) => {
    AWS.checkConnectionByFetchingQueues({})
      .then((data) => {
        expect(data.QueueUrls[0]).to.equal(process.env.AWS_URL);
        done();
      }).catch((err) => {
        console.error('error connectiong to AWS', err);
        done();
      });
  });

  it('should send a sql data set to AWS SQS Queue', (done) => {
    const message = "(3126, '2017-08-01', 1501630488185, 3, 6263),";
    AWSQueries.sendMessage(message)
      .then((data) => {
        expect(data.MessageId).to.not.equal(undefined);
        done();
      }).catch((err) => {
        console.error('error sending sql data set to AWS', err);
        done();
      });
  });

  it('shoud send a json message to AWS SQS Queue', (done) => {
    const json = '{"user_id":22201,"sessionId":6277,"eventTypeId":1,"date":"2017- 08 - 01","createdAt":"1501631930534"}';
    AWSQueries.sendMessage(json)
      .then((data) => {
        expect(data.MessageId).to.not.equal(undefined);
        done();
      }).catch((err) => {
        console.error('error sending json message to AWS', err);
        done();
      });
  });

  it('should receive one message from AWS SQS', (done) => {
    const params = {
      QueueUrl: process.env.AWS_URL,
      MaxNumberOfMessages: 1
    };

    AWSQueries.getMessages(params)
      .then((data) => {
        messageToDelete = data.Messages[0].ReceiptHandle;
        expect(data.Messages.length).to.equal(1);
        expect(data.Messages[0].MessageId).to.not.equal(undefined);
        expect(data.Messages[0].ReceiptHandle).to.not.equal(undefined);
        done();
      }).catch((err) => {
        console.error('error getting one message from AWS', err);
        done();
      });
  });

  it('should delete messages from AWS SQS', (done) => {
    const params = {
      QueueUrl: process.env.AWS_URL,
      ReceiptHandle: messageToDelete
    };
    AWSQueries.deleteMessage(params)
      .then((data) => {
        expect(data.ResponseMetadata).to.not.equal(undefined);
        done();
      }).catch((err) => {
        console.error('error deleting a messages from AWS', err);
        done();
      });
  });
});
