const { db } = require('./index.js');

const queriesForAnalysis = {
  getViews: '',
  getSongResponses: '',
  getSongReactions: '',
  getSearches: '',
  getLogs: ''
}

// insert bulk data
const queryDB = query => db.query(query).catch(err => console.log('error statement in queries', err));


module.exports = {
  queryDB,
  queriesForAnalysis
};
