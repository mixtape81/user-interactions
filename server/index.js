const express = require('express');
const bodyParser = require('body-parser');
const env = require('./environment.js');
const dummydata = require('../database/dummyData.js');

console.log('environment in server', env.ENV_PATH);

const app = express();
const port = process.env.PORT;
const queries = require('../database/queries.js');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello, world!');
});


app.get('/playlistviews', (req, res) => {
// use this request to send playlist views to analysis
  res.send();
});

app.get('/songresponses', (req, res) => {
// use this request to send songs heard/skipped
  res.send();
});

app.get('/songreactions', (req, res) => {
// use this request to send songs liked/disliked
  res.send();
});


app.post('/dummydata', (req, res) => {
  dummydata.dropTables()
    .then(() => dummydata.addEvents())
    .then(() => dummydata.testRun())
    .then((result) => {
      console.log('RREESSULLTT', result);
      res.send(result);
    })
    .catch((err) => {
      console.log('error during dummy data', err);
      res.status(400).send('FAILED');
    });
});

app.post('/view', (req, res) => {
  queries.addToLogs(req.body)
    .then((result) => {
      req.body.logId = result.id;
      return queries.addToPlaylistView(req.body);
    })
    .then((result) => {
      console.log('added to playlistview', result);
      res.send('OK MAGIC HAPPENDED!');
    })
    .catch((err) => {
      console.log('errror adding to logs', err);
      res.status(400).send('FAILED TO ADD TO LOGS');
    });
});

app.post('/search', (req, res) => {
  queries.addToLogs(req.body)
    .then((result) => {
      req.body.logId = result.id;
      return queries.addToSearch(req.body);
    })
    .then((result) => {
      console.log('added to search', result);
      res.send('OK MAGIC HAPPENDED!');
    })
    .catch((err) => {
      console.log('errror adding to search', err);
      res.status(400).send('FAILED TO ADD TO LOGS');
    });
});

app.post('/songreaction', (req, res) => {
  queries.addToLogs(req.body)
    .then((result) => {
      req.body.logId = result.id;
      return queries.addToSongReactions(req.body);
    })
    .then((result) => {
      console.log('added to song reactions', result);
      res.send('OK MAGIC HAPPENDED!');
    })
    .catch((err) => {
      console.log('errror adding to reactions', err);
      res.status(400).send('FAILED TO ADD TO LOGS');
    });
});

app.post('/songresponse', (req, res) => {
  queries.addToLogs(req.body)
    .then((result) => {
      req.body.logId = result.id;
      return queries.addToSongResponses(req.body);
    })
    .then((result) => {
      console.log('added to song responses', result);
      res.send('OK MAGIC HAPPENDED!');
    })
    .catch((err) => {
      console.log('errror adding to responses', err);
      res.status(400).send('FAILED TO ADD TO LOGS');
    });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = {
  app
};

