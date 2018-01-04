const express = require('express');
const bodyParser = require('body-parser');
require('../environment.js');
const dummydata = require('../database/drop-tables.js');
const helpers = require('../helpers/helpers.js');
// const AWS = require('../server-aws/aws-queries.js');

const app = express();
const port = process.env.PORT;
const queries = require('../database/queries.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// basic hello word get request
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

process.on('unhandledRejection', (reason, p) => {
  console.log("Unhandled Rejection at: Promise ", p, " reason: ", reason);
  // application specific logging, throwing an error, or other logic here
});

// this request adds a playlist view to the database
app.post('/playlistview', (req, res) => {
  queries.queryDB(`${helpers.insertQueries.logs} ${helpers.parseValues('logs', req.body)}`)
    .then(() => queries.queryDB(`${helpers.retrieveQueries.logId} logs."createdAt" = ${req.body.createdAt} AND logs.user_id = ${req.body.userId}`))
    .then((result) => {
      req.body.logId = helpers.getId(result);
      return queries.queryDB(`${helpers.insertQueries.views} ${helpers.parseValues('view', req.body)}`)
    })
    .then(() => res.send('PlaylistView Added'))
    .catch(err => res.status(400).send(err));
});

// this request adds a search event to the database
app.post('/search', (req, res) => {
  queries.queryDB(`${helpers.insertQueries.logs} ${helpers.parseValues('logs', req.body)}`)
    .then(() => queries.queryDB(`${helpers.retrieveQueries.logId} logs."createdAt" = ${req.body.createdAt} AND logs.user_id = ${req.body.userId}`))
    .then((result) => {
      req.body.logId = helpers.getId(result);
      return queries.queryDB(`${helpers.insertQueries.searches} ${helpers.parseValues('search', req.body)}`)
    })
    .then(() => res.send('Search Event Added'))
    .catch(err => res.status(400).send(err));
});

// this request adds a song reaction to the database
app.post('/songreaction', (req, res) => {
  queries.queryDB(`${helpers.insertQueries.logs} ${helpers.parseValues('logs', req.body)}`)
    .then(() => queries.queryDB(`${helpers.retrieveQueries.logId} logs."createdAt" = ${req.body.createdAt} AND logs.user_id = ${req.body.userId}`))
    .then((result) => {
      req.body.logId = helpers.getId(result);
      return queries.queryDB(`${helpers.insertQueries.reactions} ${helpers.parseValues('reaction', req.body)}`)
    })
    .then(() => res.send('Song Reaction Added'))
    .catch(err => res.status(400).send(err));
});

// this request adds a song response to the database
app.post('/songresponse', (req, res) => {
  queries.queryDB(`${helpers.insertQueries.logs} ${helpers.parseValues('logs', req.body)}`)
    .then(() => queries.queryDB(`${helpers.retrieveQueries.logId} logs."createdAt" = ${req.body.createdAt} AND logs.user_id = ${req.body.userId}`))
    .then((result) => {
      req.body.logId = helpers.getId(result);
      return queries.queryDB(`${helpers.insertQueries.responses} ${helpers.parseValues('response', req.body)}`)
    })
    .then(() => res.send('Song Response Added'))
    .catch(err => res.status(400).send(err));
});

// this request gets all playlist views for a given date
app.get('/playlistviews', (req, res) => {
  // req.query.date
  const query = `SELECT playlist_id, genre_id, "createdAt" FROM playlist_views where playlist_views."createdAt" between ${req.query.start} and ${req.query.end}`;
  queries.queryDB(query)
    .then(result => res.send(result))
    .catch(err => res.status(400).send(err))
});

// this request to get songs heard/skipped from database for a given date
app.get('/songresponses', (req, res) => {
  const query = `SELECT * FROM song_responses where song_responses.date='${req.query.date}'`;
  queries.queryDB(query)
    .then(result => res.send(result))
    .catch(err => res.status(400).send(err)); 
});

// // this request to get songs liked/disliked from database for a given date
app.get('/songreactions', (req, res) => {
  const query = `SELECT * FROM song_responses where song_responses.date='${req.query.date}'`;
  queries.queryDB(query)
    .then(result => res.send(result))
    .catch(err => res.status(400).send(err));
});

app.post('/dummydata', (req, res) => {
  dummydata.dropTables()
    .then(() => dummydata.addEvents())
    // .then(() => dummydata.testRun())
    .then(() => res.send('DONE'))
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = {
  app
};

