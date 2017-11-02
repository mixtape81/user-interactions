const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const files = require('./files-index.js');
const queries = require('../database/queries.js');
const { addDocumentsInBulk } = require('../elasticsearch/queries');

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

// const feedElasticSearch = (file, type) => {
//   fs.readFileAsync(file)
//     .then((data) => {
//       console.log('LOGS DATA LENGTH', Math.floor(data.toString().split('\n').length / 2));
//       addDocumentsInBulk(process.env.INDEX, type, data.toString());
//       return null;
//     })
//     .then(() => fs.truncate(file))
//     .catch(err => console.log('in data generater after adding to elastic error', err));
// };

const feedElasticSearch = () => {
  console.log('CAME TO FEED ELASTIC SEARCH');
  fs.readFileAsync(files.logsJSON)
    .then((logs) => {
      console.log('LOGS DATA LENGTH', Math.floor(logs.toString().split('\n').length / 2));
      addDocumentsInBulk(process.env.INDEX, 'logs', logs.toString());
      return null;
    })
    .then(() => fs.truncate(files.logsJSON))
    .then(() => fs.readFileAsync(files.playlistViewsJSON))
    .then((views) => {
      console.log('VIEWS DATA LENGTH', Math.floor(views.toString().split('\n').length / 2));
      addDocumentsInBulk(process.env.INDEX, 'playlist_views', views.toString());
      return null;
    })
    .then(() => fs.truncate(files.playlistViewsJSON))
    .then(() => fs.readFileAsync(files.searchesJSON))
    .then((searches) => {
      console.log('SEARCHES DATA LENGTH', Math.floor(searches.toString().split('\n').length / 2));
      addDocumentsInBulk(process.env.INDEX, 'searches', searches.toString());
      return null;
    })
    .then(() => fs.truncate(files.searchesJSON))
    .then(() => fs.readFileAsync(files.songReactionsJSON))
    .then((reactions) => {
      console.log('SONG REACTIONS DATA LENGTH', Math.floor(reactions.toString().split('\n').length / 2));
      addDocumentsInBulk(process.env.INDEX, 'song_reactions', reactions.toString());
      return null;
    })
    .then(() => fs.truncate(files.songReactionsJSON))
    .then(() => fs.readFileAsync(files.songResponsesJSON))
    .then((responses) => {
      console.log('SONG RESPONSES DATA LENGTH', Math.floor(responses.toString().split('\n').length / 2));
      addDocumentsInBulk(process.env.INDEX, 'song_responses', responses.toString());
      return null;
    })
    .then(() => fs.truncate(files.songResponsesJSON))
    .catch(err => console.log('in data generater after adding to elastic error', err));
};

module.exports = {
  updateDatabase,
  feedElasticSearch
};

