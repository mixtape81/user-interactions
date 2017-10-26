const db = require('./index.js');

// events array
const events = [
  { type: 'playlist_views' },
  { type: 'search' },
  { type: 'song_reactions' },
  { type: 'song_responses' }
];

// drops all tables in database when needed
const dropTables = () => (db.EventType.sync({ force: true })
  .then(() => db.Search.sync({ force: true }))
  .then(() => db.SongResponse.sync({ force: true }))
  .then(() => db.SongReaction.sync({ force: true }))
  .then(() => db.PlaylistView.sync({ force: true }))
  .then(() => db.Log.sync({ force: true }))
  .then(() => db.Session.sync({ force: true }))
  .catch(err => console.log('error for syncing tables', err))
);

// adds event types to the database after database is dropped
const addEvents = () => (db.EventType.bulkCreate(events)
  .catch(err => console.log('error adding events to database', err))
);

module.exports = {
  dropTables,
  addEvents
};
