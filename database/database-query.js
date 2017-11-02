const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const files = require('./files-index.js');
const queries = require('./queries.js');

const updateDatabase = () => {
  console.log('CAME TO UPDATE DATABASE');
  return fs.readFileAsync(files.logs)
    .then((data) => {
      queries.bulkAddToDB(`INSERT INTO logs (user_id, date, "createdAt", "eventTypeId", "sessionId") VALUES ${data.toString().replace(/,\n$/, '\n')}`);
    })
    .then(() => fs.truncateAsync(files.logs))
    .then(() => fs.readFileAsync(files.playlistViews))
    .then((views) => {
      queries.bulkAddToDB(`INSERT INTO playlist_views (playlist_id, genre_id, date, "createdAt", "logId") VALUES ${views.toString().replace(/,\n$/, '\n')}`);
    })
    .then(() => fs.truncateAsync(files.playlistViews))
    .then(() => fs.readFileAsync(files.searches))
    .then((searches) => {
      queries.bulkAddToDB(`INSERT INTO searches (value, date, "createdAt", "logId") VALUES ${searches.toString().replace(/,\n$/, '\n')}`);
    })
    .then(() => fs.truncateAsync(files.searches))
    .then(() => fs.readFileAsync(files.songResponses))
    .then((responses) => {
      queries.bulkAddToDB(`INSERT INTO song_responses (song_id, "listenedTo", playlist_id, genre_id, "date", "createdAt", "logId") VALUES ${responses.toString().replace(/,\n$/, '\n')}`);
    })
    .then(() => fs.truncateAsync(files.songResponses))
    .then(() => fs.readFileAsync(files.songReactions))
    .then((reactions) => {
      queries.bulkAddToDB(`INSERT INTO song_reactions (song_id, liked, playlist_id, genre_id, date, "createdAt", "logId") VALUES ${reactions.toString().replace(/,\n$/, '\n')}`);
    })
    .then(() => fs.truncateAsync(files.songReactions))
    .then(() => 'DONE');
};

module.exports = updateDatabase;
