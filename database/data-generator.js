//  Data to generate
// Platlist id between 1-20
// song ids between 1 - 10,000,000
// user ids between 1- 10,000,000
// booleans for likes/dislikes/heard/skipped
// an array of search terms

// start from august first
// a cron job that runs every minute
// assume  that is adds a 100000 behaviour points every minute;
// every hour that is 60000;
// need to do it 16-18 hours
// every minute it should increment time


// user comes in
// first thing to do is check their session
// meaning go check if session id exists in database
// if yes, do one of 2 options
// trigger a playlist view click
// OR
// a search term
// if Playlist view is chosen
// generate a session time thats between (15-120 mins)
// calculate the number of song events. (Range song heard range from 15-100%)
// generate likes or dislikes for half of those songs

// else if they search

const genres = ['Rock and Roll', 'Folk', 'Country Western', 'Classical', 'Reggaeton', 'Jazz', 'Mixed', 'Blues', 'Disco', 'Metal'];

const generateRandomPlaylistId = () => Math.floor(Math.random() * 20) + 1;

const generateRandomGenreId = () => Math.floor(Math.random() * 10) + 1;

const generateRandomSongId = () => Math.floor(Math.random() * 10000000) + 1;

const generateRandomUserId = () => Math.floor(Math.random() * 10000000) + 1;

const generateRandomSession = () => Math.floor(Math.random() * 1000000) + 1;

const generateRandomSearch = () => genres[Math.floor(Math.random() * 10)];


module.exports = {
  generateRandomPlaylistId,
  generateRandomUserId,
  generateRandomGenreId,
  generateRandomSession,
  generateRandomSearch,
  generateRandomSongId
};
