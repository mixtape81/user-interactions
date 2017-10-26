const express = require('express');
const bodyParser = require('body-parser');
require('./environment.js');
// const dummydata = require('../database/dummyData.js');
const helpers = require('../helpers/helpers.js');

const app = express();
const port = process.env.PORT;
const queries = require('../database/queries.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// add a date for all post requests
app.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.date = req.body.date ? req.body.date : new Date();
  }
  next();
});

// basic hello word get request
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// this request gets all playlist views for a given date
app.get('/playlistviews', (req, res) => {
  queries.getPlaylistViews(req.query.date)
    .then(result => res.send(result))
    .catch(err => res.status(400).send(err));
});

// this request to get songs heard/skipped from database for a given date
app.get('/songresponses', (req, res) => {
  queries.getSongResponses(req.query.date)
    .then((result) => {
      if (!result.length) {
        res.send(result);
      } else {
        res.send(helpers.organizeSongsByPlaylist(result));
      }
    })
    .catch(err => res.status(400).send(err));
});

// this request to get songs liked/disliked from database for a given date
app.get('/songreactions', (req, res) => {
  queries.getSongReactions(req.query.date)
    .then((result) => {
      if (!result.length) {
        res.send(result);
      } else {
        res.send(helpers.organizeSongsByPlaylist(result));
      }
    })
    .catch(err => res.status(400).send(err));
});

// this request adds a playlist view to the database
app.post('/view', (req, res) => {
  // req.body.date = new Date();
  queries.addToLogs(req.body)
    .then((result) => {
      req.body.logId = result.id;
      return queries.addToPlaylistView(req.body);
    })
    .then((result) => {
      res.send(result.dataValues);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
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

// app.post('/dummydata', (req, res) => {
//   dummydata.dropTables()
//     .then(() => dummydata.addEvents())
//     .then(() => dummydata.testRun())
//     .then((result) => {
//       res.send(result);
//     })
//     .catch((err) => {
//       res.status(400).send(err);
//     });
// });

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = {
  app
};

