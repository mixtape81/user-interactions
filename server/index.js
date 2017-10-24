const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database/index.js');
const dummydata = require('../database/dummydata.js');

const app = express();
const port = process.env.PORT || 2244;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.post('/dummydata', (req, res) => {
  dummydata.dropTables()
    .then(() => dummydata.addEvents())
    .then(() => dummydata.testRun())
    .then((result) => {
      console.log('RREESSULLTT', result);
      res.send('OK');
    })
    .catch((err) => {
      console.log('error during dummy data', err);
      res.status(400).send('FAILED');
    });
});

app.listen(port, () => {
  console.log('Listening on port 2244');
});

module.exports = {
  app
};

