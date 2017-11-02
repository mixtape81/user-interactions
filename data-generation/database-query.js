const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const files = require('./files-index.js');
const db = require('../database/queries.js');
const { addDocumentsInBulk } = require('../elasticsearch/queries');

const insertQueries = {
  logs: 'INSERT INTO logs (user_id, date, "createdAt", "eventTypeId", "sessionId") VALUES',
  views: 'INSERT INTO playlist_views (playlist_id, genre_id, date, "createdAt", "logId") VALUES',
  searches: 'INSERT INTO searches (value, date, "createdAt", "logId") VALUES',
  reactions: 'INSERT INTO song_reactions (song_id, liked, playlist_id, genre_id, date, "createdAt", "logId") VALUES',
  responses: 'INSERT INTO song_responses (song_id, "listenedTo", playlist_id, genre_id, "date", "createdAt", "logId") VALUES'
};

const formatData = data => data.toString().replace(/,\n$/, '\n');

const updateTable = (query, file) => (
  fs.readFileAsync(file)
    .then((data) => {
      const parsed = formatData(data);
      return db.queryDB(`${query} ${parsed}`);
    })
    .then(() => fs.truncateAsync(file))
    .catch(err => console.log(`error updating table with file ${file}`, err))
);

const updateDatabase = () => (
  updateTable(insertQueries.logs, files.logs)
    .then(() => updateTable(insertQueries.views, files.playlistViews))
    .then(() => updateTable(insertQueries.searches, files.searches))
    .then(() => updateTable(insertQueries.reactions, files.songReactions))
    .then(() => updateTable(insertQueries.responses, files.songResponses))
    .then(() => {
      console.log('updated database!!!!!!');
      return feedElasticsearch();
    })
    .catch(err => console.log('error updating all tables in database', err))
);

const feedOneIndexTypeInElasticsearch = (file, type) => (
  fs.readFileAsync(file)
    .then((data) => {
      addDocumentsInBulk(process.env.INDEX, type, data.toString());
      return null;
    })
    .then(() => fs.truncate(file))
    .catch(err => console.error(`error updating ${process.env.INDEX} ${type}`, err))
);

const feedElasticsearch = () => (
  feedOneIndexTypeInElasticsearch(files.logsJSON, 'logs')
    .then(() => feedOneIndexTypeInElasticsearch(files.playlistViewsJSON, 'playlistviews'))
    .then(() => feedOneIndexTypeInElasticsearch(files.searchesJSON, 'searches'))
    .then(() => feedOneIndexTypeInElasticsearch(files.songReactionsJSON, 'songreactions'))
    .then(() => feedOneIndexTypeInElasticsearch(files.songResponsesJSON, 'songresponses'))
    .then(() => console.log('updated elasticsearch!!!!!!!'))
    .catch(err => console.error('error updating elastic search index', err))
);

module.exports = {
  updateDatabase,
  feedElasticsearch
};

