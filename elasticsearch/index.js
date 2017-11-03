const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'info'
});

// client.ping({ requestTimeout: 30000 }, (err) => {
//   if (err) {
//     console.error('elasticsearch cluster is down!', err);
//   } else {
//     console.log('All is well');
//   }
// });

module.exports = {
  client
};
