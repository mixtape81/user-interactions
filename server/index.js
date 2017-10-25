const express = require('express');
const bodyParser = require('body-parser');
const env = require('./environment.js');

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

app.post('/view', (req, res) => {
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

app.post('/search', (req, res) => {
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

app.post('/songreaction', (req, res) => {
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

app.post('/songresponse', (req, res) => {
  queries.addToLogs(req.body)
    .then((result) => {
      req.body.logId = result.id;
      return queries.addToSongResponses(req.body);
    })
    .then(result => res.send(result.dataValues))
    .catch(err => res.status(400).send(err));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = {
  app
};

