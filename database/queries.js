const { db } = require('./index.js');

const addToLogs = (action) => {
  const queryToLogs = 'insert into logs ("eventTypeId", "user_id", "sessionId", "createdAt", "updatedAt") values (?, ?, ?, ?, ?)';
  const dataForLogs = {
    replacements: [
      1,
      action.userId,
      action.sessionId,
      action.createdAt,
      action.updatedAt
    ]
  };
  return db.query(queryToLogs, dataForLogs).spread();
};

const addToPlayListView = (view, callback) => {
  const queryToPlaylistView = 'insert into playlist_views ("playlist_id", s"logId", "genre_id", "createdAt", "updatedAt") values (?, ?, ?, ?, ?)';
  const dataForView = {
    replacements: [
      view.playlist_id,
      view.id,
      view.genre_id
    ]
  };
  return db.query(queryToPlaylistView, dataForView, callback);
};

const addToSongResponse = () => {

};

const addToSongReactions = () => {

};

const getPlaylistViews = () => {

};

const getSongReactions = () => {

};

const getSongResponses = () => {

};

module.exports = {
  addToLogs,
  addToPlayListView,
  addToSongReactions,
  addToSongResponse,
  getPlaylistViews,
  getSongReactions,
  getSongResponses
};
