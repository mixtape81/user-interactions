

// start from august first
// a cron job that runs every minute ??
// run every 5 minutes ??

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

const generateRandomEndTime = () => {
  const sessionTime = Math.floor(Math.random() * 60) * 600000;
  const time = Date.now();
  return time + sessionTime;
};

const generateRandomUserId = () => Math.floor(Math.random() * 10000000) + 1;
const generateRandomSession = () => { hash: `${generateRandomUserId()}--${Date.now()}--${generateRandomEndTime()}`};
// create 500 random sessions;
// assign to random user
// make session objects with start and end session time
// const sessions = [];
// for (let i = 0; i < 500; i += 1) {
//   sessions.push({ hash: `${generateRandomUserId()}--${Date.now()}--${generateRandomEndTime()}` });
// }
// return sessions;

const genres = ['Rock and Roll', 'Folk', 'Country Western', 'Classical', 'Reggaeton', 'Jazz', 'Mixed', 'Blues', 'Disco', 'Metal'];

const generateRandomPlaylistId = () => Math.floor(Math.random() * 20) + 1;

const generateRandomGenreId = () => Math.floor(Math.random() * 10) + 1;

const generateRandomSongId = () => Math.floor(Math.random() * 10000000) + 1;

// const generateRandomSession = () => Math.floor(Math.random() * 1000000) + 1;

const generateRandomSearch = () => genres[Math.floor(Math.random() * 10)];


module.exports = {
  generateRandomPlaylistId,
  generateRandomUserId,
  generateRandomGenreId,
  generateRandomSession,
  generateRandomSearch,
  generateRandomSongId,
  generateRandomEndTime
};
