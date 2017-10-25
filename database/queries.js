const db = require('./index.js');

const addToPlayListView = (view, callback) => {
  let queryToLogs = 'insert into logs ("eventTypeId", "user_id", "sessionId", "createdAt", "updatedAt") values \
    (?, ?, ?, ?, ?)';
  let queryToPlaylistView = 'insert into playlist_views ("playlist_id", \
    "logId", "genre_id", "createdAt", "updatedAt") values (?, ?, ?, ?, ?)';
  let dataForLogs = { replacements: [1, view.userId, view.sessionId, view.createdAt, view.updatedAt] };  
  return db.db.query(queryToLogs, dataForLogs, callback);
    // .then(result => {
    //   console.log('here with result', result);
    //   let dataForView = { replacements: [view.playlist_id, result.id, view.genre_id] };
    //   return db.db.query(queryToPlaylistView, dataForView);
    // })
    // .then((view) => console.log('done adding to playlist view', view))
    // .catch(err => console.log('error adding to playlist view', err));
}


module.exports = {
  addToPlayListView
};
