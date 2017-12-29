const express = require('express');
const bodyParser = require('body-parser');
require('../environment.js');
const dummydata = require('../database/drop-tables.js');
// const AWS = require('../server-aws/aws-queries.js');

const app = express();
const port = process.env.PORT;
const queries = require('../database/queries.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// add a date for all post requests
app.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.date = req.body.date ? req.body.date : new Date().toISOString().match(/\d+-\d+-\d+/);
  }
  next();
});

// basic hello word get request
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// this request gets all playlist views for a given date
app.get('/playlistviews', (req, res) => {
  // req.query.date
  const query = `SELECT playlist_id, genre_id, "createdAt" FROM playlist_views where playlist_views."createdAt" between ${req.query.start} and ${req.query.end}`;
  // 1507420800000
  // 1507507200000
  // const message = {
  //   MessageBody: JSON.stringify(result),
  //   QueueUrl: url,
  //   MessageAttributes: {
  //     Event: {
  //       DataType: 'String',
  //       StringValue: 'playlist views'
  //     }
  //   }
  // };
  // return AWS.sendMessage(message);
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
  // const body = {
  //   query: {
  //     size: 10000,
  //     term: {
  //       date: req.query.date
  //     }
  //   }
  // };   
});

// // this request to get songs liked/disliked from database for a given date
app.get('/songreactions', (req, res) => {
  const query = `SELECT * FROM song_responses where song_responses.date='${req.query.date}'`;
  queries.queryDB(query)
    .then(result => res.send(result))
    .catch(err => res.status(400).send(err));
});

// this request adds a playlist view to the database
app.post('/playlistview', (req, res) => {
  // req.body.date = new Date();
  console.log('request', req.body);
  // queries.addToLogs(req.body)
  //   .then((result) => {
  //     req.body.logId = result.id;
  //     return queries.addToPlaylistView(req.body);
  //   })
  //   .then((result) => {
  //     res.send(result.dataValues);
  //   })
  //   .catch((err) => {
  //     res.status(400).send(err);
  //   });
});

// this request adds a genre searched to the database
app.post('/search', (req, res) => {
  // req.body.date = new Date();
  queries.addToLogs(req.body)
    .then((result) => {
      req.body.logId = result.id;
      return queries.addToSearch(req.body);
    })
    .then((result) => {
      res.send(result.dataValues);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

// this request adds a song reaction to the database
app.post('/songreaction', (req, res) => {
  // req.body.date = new Date();
  queries.addToLogs(req.body)
    .then((result) => {
      req.body.logId = result.id;
      return queries.addToSongReactions(req.body);
    })
    .then((result) => {
      res.send(result.dataValues);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

// this request adds a song response to the database
app.post('/songresponse', (req, res) => {
  // req.body.date = new Date();
  queries.addToLogs(req.body)
    .then((result) => {
      req.body.logId = result.id;
      return queries.addToSongResponses(req.body);
    })
    .then(result => res.send(result.dataValues))
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

