const db = require('./index.js');

const addToLogs = action => db.Log.create(action);
// const queryToLogs = 'insert into logs ("eventTypeId", "user_id", "sessionId",
// "createdAt", "updatedAt") values (?, ?, ?, ?, ?)';

const addToPlaylistView = view => db.PlaylistView.create(view);
// const queryToPlaylistView = 'insert into playlist_views
// ("playlist_id", s"logId", "genre_id", "createdAt", "updatedAt") values (?, ?, ?, ?, ?)';

const addToSearch = search => db.Search.create(search);

const addToSongResponses = response => db.SongResponse.create(response);

const addToSongReactions = reaction => db.SongReaction.create(reaction);

const getPlaylistViews = playlistId => (
  db.PlaylistView.findAll({ where: { playlist_id: playlistId } })
);

const getSongReactions = playlistId => (
  db.SongReaction.findAll({ where: { playlist_id: playlistId } })
);

const getSongResponses = playlistId => (
  db.SongResonse.findAll({ where: { playlist_id: playlistId } })
);

module.exports = {
  addToLogs,
  addToPlaylistView,
  addToSongReactions,
  addToSongResponses,
  getPlaylistViews,
  getSongReactions,
  getSongResponses,
  addToSearch
};
