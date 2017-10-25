const db = require('./index.js');
const random = require('./data-generator.js');
const rp = require('request-promise');

const events = [
  { type: 'playlist_views' },
  { type: 'search' },
  { type: 'song_reactions' },
  { type: 'song_responses' }
];

const dropTables = () => (db.EventType.sync({ force: true })
  .then(() => db.Search.sync({ force: true }))
  .then(() => db.SongResponse.sync({ force: true }))
  .then(() => db.SongReaction.sync({ force: true }))
  .then(() => db.PlaylistView.sync({ force: true }))
  .then(() => db.Log.sync({ force: true }))
  .then(() => db.Session.sync({ force: true }))
  .catch(err => console.log('error for syncing tables', err))
);

const addEvents = () => (db.EventType.bulkCreate(events)
  .catch(err => console.log('error adding events to database', err))
);

const testRun = () => (db.Session.create({ user_id: 10, hash: '3232432' })
  .then((result) => {
    console.log('result after adding to session', result);
    return db.Log.create({ sessionId: result.id, user_id: result.user_id, eventTypeId: 1 });
  })
  .then(result => db.PlaylistView.create({ logId: result.id, genre_id: 5, playlist_id: 4 }))
  .then((result) => {
    console.log('result after adding to playlist view', result);
    return db.PlaylistView.find({ where: { logId: 1 }, include: [db.Log] });
  })
  // .catch(err => console.log('error test runnnnnnnnnnnn', err))
);

const addToViewTest = () => {
  const view = {
    playlist_id: random.generateRandomPlaylistId(),
    genre_id: random.generateRandomGenreId(),
    userId: random.generateRandomUserId(),
    sessionId: random.generateRandomSession(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  const options = {
    method: 'POST',
    uri: `${process.env.HOSTNAME}/view`,
    body: view,
    contentType: 'application/json',
    json: true
  };
  return rp(options);
};


module.exports = {
  dropTables,
  addEvents,
  testRun,
  addToViewTest
};
