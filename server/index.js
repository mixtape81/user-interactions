const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database/schema.js');

const app = express();
const port = process.env.PORT || 2244;

// db.dropTables()
//   .then(() => db.createTables())
//   .then(() => db.addData())
//   .catch(err => console.log('failed to create tables', err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log('Listening on port 2244');
});

module.exports = {
  app
};

