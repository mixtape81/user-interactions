const db = require('./index.js');

const dropTables = () => (db.EventType.sync({ force: true })
  .then(() => db.Search.sync({ force: true }))
  .then(() => db.SongResponse.sync({ force: true }))
  .then(() => db.SongReaction.sync({ force: true }))
  .then(() => db.PlaylistView.sync({ force: true }))
  .then(() => db.Log.sync({ force: true }))
  .then(() => db.Session.sync({ force: true }))
  .catch(err => console.log('error for syncing tables', err))
);

const addEvents = () => (db.EventType.findOrCreate({ where: { type: 'playlist_views' } })
  .then(() => db.EventType.findOrCreate({ where: { type: 'search' } }))
  .then(() => db.EventType.findOrCreate({ where: { type: 'song_reactions' } }))
  .then(() => db.EventType.findOrCreate({ where: { type: 'song_responses' } }))
  .catch(err => console.log('error adding events to database', err))
);

const testRun = () => (db.Session.create({ user_id: 10, hash: '3232432' })
  .then((result) => {
    // console.log('result after adding to session', result);
    return db.Log.create({ sessionId: result.id, user_id: result.user_id, eventTypeId: 1 });
  })
  .then(result => db.PlaylistView.create({ logId: result.id, genre_id: 5, playlist_id: 4 }))
  .then((result) => {
    // console.log('result after adding to playlist view', result);
    return db.PlaylistView.find({ where: { logId: 1 }, include: [db.Log] });
  })
  // .catch(err => console.log('error test runnnnnnnnnnnn', err))
);

module.exports = {
  dropTables,
  addEvents,
  testRun
};
