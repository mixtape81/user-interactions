const db = require('./index.js');

const getPlaylistViews = date => db.PlaylistView.findAll({ where: { date } });

const getSongReactions = date => db.SongReaction.findAll({ where: { date } });

const getSongResponses = date => db.SongResponse.findAll({ where: { date } });

// insert bulk data
const bulkAddToDB = query => db.db.query(query).catch(err => console.log('error statement in queries', err));

// const addToLogs = action => db.Log.create(action);
// // const queryToLogs = 'insert into logs ("eventTypeId", "user_id", "sessionId",
// // "createdAt", "updatedAt") values (?, ?, ?, ?, ?)';

// const addToPlaylistView = view => db.PlaylistView.create(view);
// // const queryToPlaylistView = 'insert into playlist_views
// // ("playlist_id", s"logId", "genre_id", "createdAt", "updatedAt") values (?, ?, ?, ?, ?)';

// const addToSearch = search => db.Search.create(search);

// const addToSongResponses = response => db.SongResponse.create(response);

// const addToSongReactions = reaction => db.SongReaction.create(reaction);

module.exports = {
  getPlaylistViews,
  getSongReactions,
  getSongResponses,
  bulkAddToDB
  // addToLogs,
  // addToPlaylistView,
  // addToSongReactions,
  // addToSongResponses,
  // addToSearch,
};
