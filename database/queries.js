const db = require('./bookshelf.js');

const addEvents = () => (
  db.EventType.forge({ type: 'playlist_view' }).save()
    .then(() => db.EventType.forge({ type: 'search' }).save())
    .then(() => db.EventType.forge({ type: 'song_reactions' }).save())
    .then(() => db.EventType.forge({ type: 'song_responses' }).save())
    .catch(err => console.log('error adding events to database', err))
);

module.exports = {
  addEvents
};
