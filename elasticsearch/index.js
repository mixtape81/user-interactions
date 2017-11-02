const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'info'
});

// client.cluster.health({}, (err, res) => {
//   console.log('-- Client Health --', res);
// });

// client.ping({ requestTimeout: 30000 }, (error) => {
//   if (error) {
//     console.error('elasticsearch cluster is down!');
//   } else {
//     console.log('All is well');
//   }
// });

module.exports = {
  client
};
