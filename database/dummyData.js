const db = require('./index.js');

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

module.exports = {
  dropTables,
  addEvents
};
