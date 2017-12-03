const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const files = require('./files-index.js');
const db = require('../database/queries.js');
const { addDocumentsInBulk } = require('../elasticsearch/queries');
// const SQS = require('../server-aws/aws-queries.js');


// ******************************** HELPERS FUNCTIONS ************************************ //
const formatData = data => data.toString().replace(/,\n$/, '\n');

// *************************** DATABASE && ELASTICSEARH QUERIES ************************* //

const insertQueries = {
  logs: 'INSERT INTO logs (user_id, date, "createdAt", "eventTypeId", "sessionId") VALUES',
  views: 'INSERT INTO playlist_views (playlist_id, genre_id, date, "createdAt", "logId") VALUES',
  searches: 'INSERT INTO searches (value, date, "createdAt", "logId") VALUES',
  reactions: 'INSERT INTO song_reactions (song_id, liked, playlist_id, genre_id, date, "createdAt", "logId") VALUES',
  responses: 'INSERT INTO song_responses (song_id, "listenedTo", playlist_id, genre_id, "date", "createdAt", "logId") VALUES'
};

const updateTable = (query, file) => (
  fs.readFileAsync(file)
    .then(data => db.queryDB(`${query} ${formatData(data)}`))
    .then(() => fs.truncateAsync(file))
    .catch(err => console.error(`error updating table with file ${file}`, err))
);

const feedOneIndexTypeInElasticsearch = (file, type) => (
  fs.readFileAsync(file)
    .then(data => addDocumentsInBulk(process.env.INDEX, type, data.toString()))
    .then(() => fs.truncateAsync(file))
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
    .catch(err => console.error('error updating all tables in database', err))
);


// ******************************** AWS SQS QUERIES **************************** //

const url = process.env.AWS_URL;

const sendContentToSQS = (file, table) => (
  fs.readFileAsync(file)
    .then((data) => {
      const message = {
        MessageBody: formatData(data),
        QueueUrl: url,
        MessageAttributes: {
          table: {
            DataType: 'String',
            StringValue: table
          }
        }
      };
      return SQS.sendMessage(message);
    })
    .then(() => fs.truncateAsync(file))
    .catch(err => console.log(`error sending ${file} data to SQS`, err))
);

const sendJSONtoSQS = (file, type) => (
  fs.readFileAsync(file)
    .then((data) => {
      const message = {
        MessageBody: data.toString(),
        QueueUrl: url,
        MessageAttributes: {
          index: {
            DataType: 'String',
            StringValue: process.env.INDEX
          },
          type: {
            DataType: 'String',
            StringValue: type
          }
        }
      };
      return SQS.sendMessage(message);
    })
    .then(() => fs.truncateAsync(file))
    .catch(err => console.log(`error sending ${file} data to SQS`, err))
);

const updateAWS = () => (
  sendContentToSQS(files.logs, 'logs')
    .then(() => sendContentToSQS(files.playlistViews, 'playlistviews'))
    .then(() => sendContentToSQS(files.searches, 'searches'))
    .then(() => sendContentToSQS(files.songReactions, 'songreactions'))
    .then(() => sendContentToSQS(files.songResponses, 'songresponses'))
    .then(() => sendJSONtoSQS(files.logsJSON, 'logs'))
    .then(() => sendJSONtoSQS(files.playlistViewsJSON, 'playlistviews'))
    .then(() => sendJSONtoSQS(files.searchesJSON, 'searches'))
    .then(() => sendJSONtoSQS(files.songReactionsJSON, 'songreactions'))
    .then(() => sendJSONtoSQS(files.songResponsesJSON, 'songresponses'))
    .then(() => console.log('SENT DATA TO AMAZON SQS'))
    .catch(err => console.log('error sending data to SQS', err))
);

module.exports = {
  updateDatabase,
  updateAWS
};

