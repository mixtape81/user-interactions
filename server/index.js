const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database/index.js');
const dummydata = require('../database/dummyData.js');
const environment = process.env.NODE_ENV;
const envPath = `.env.${environment}`;
const env_Vars = require('dotenv').config({ path: envPath });
const app = express();
const port = process.env.PORT;
const queries = require('../database/queries.js');


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

let count = 0;
app.post('/view', (req, res) => {
  // console.log('received request', req.body);
  queries.addToPlayListView(req.body, (err, results) => {
    if (err) {
      console.log('err while adding, in callbakc', err);
      res.status(400).send('FFAIILLLLEEDD');
    } else {
      console.log('result after adding to queries', results);
      res.send(`OK${++count}`);
    }
  });
});
  // console.log('result', result);
// .then(() => {
//   console.log('DooooooonnnnnnnNNNNEEEEEEEEEEE', result);
//   res.send('OK');
// })
// .catch((err) => {
//   console.log('error during dummy data', err);
//   res.status(400).send('FAILED to add to view');
// });
// });

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = {
  app
};

