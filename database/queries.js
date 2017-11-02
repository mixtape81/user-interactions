const { db } = require('./index.js');

// const getPlaylistViews = date => db.PlaylistView.findAll({ where: { date } });

// const getSongReactions = date => db.SongReaction.findAll({ where: { date } });

// const getSongResponses = date => db.SongResponse.findAll({ where: { date } });

// insert bulk data
const queryDB = query => db.query(query).catch(err => console.log('error statement in queries', err));

// const addToSearch = search => db.Search.create(search);

// const addToSongResponses = response => db.SongResponse.create(response);

// const addToSongReactions = reaction => db.SongReaction.create(reaction);

module.exports = {
  // getPlaylistViews,
  // getSongReactions,
  // getSongResponses,
  queryDB
};
