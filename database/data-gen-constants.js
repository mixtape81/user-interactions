const usersWithSessions = {};
let startDate = new Date('2017-08-01T10:00:06.420Z').toISOString();
const events = ['PlaylistView', 'Search', 'SongReaction', 'SongResponses', 'Skip'];
const genres = [
  'Rock and Roll',
  'Folk',
  'Country Western',
  'Classical',
  'Reggaeton',
  'Jazz',
  'Mixed',
  'Blues',
  'Disco',
  'Metal'
];

const playlists = {
  1: [1, 2],
  2: [3, 4],
  3: [5, 6],
  4: [7, 8],
  5: [9, 10],
  6: [11, 12],
  7: [13, 14],
  8: [15, 16],
  9: [17, 18],
  10: [19, 20]
};

const generateRandomGenreId = () => Math.floor(Math.random() * 10) + 1;

// generates a random song id
const generateRandomSongId = () => Math.floor(Math.random() * 10000000) + 1;

const generateRandomSearch = () => genres[Math.floor(Math.random() * 10)];

const generateRandomSessionId = () => Math.floor(Math.random() * 1000000) + 1;

// this function generates a boolean
const generateBoolean = () => [true, false][Math.floor(Math.random() * 2)];

// this function generates a random possbile event
const generateRandomEvent = () => Math.floor(Math.random() * 5);

// this function parses the session and returns an array of the differnt values
const parseSession = session => session.match(/\d+/g);

// this function generates a random playlist id
const generateRandomPlaylistId = () => Math.floor(Math.random() * 20) + 1;

// random index between 0 & 1
const generateRandomIndex = () => Math.floor(Math.random() * 2);

// this function generates a random user id
const generateRandomUserId = () => Math.floor(Math.random() * 10000000) + 1;

const generateRandomPlaylistInfo = () => {
  const genre = generateRandomGenreId();
  const genrePlaylists = playlists[genre];
  const playlist = genrePlaylists[generateRandomIndex()];
  return { genre, playlist };
};

module.exports = {
  usersWithSessions,
  startDate,
  events,
  genres,
  playlists,
  generateRandomGenreId,
  generateRandomSongId,
  generateRandomSearch,
  generateRandomSessionId,
  generateRandomUserId,
  generateBoolean,
  generateRandomEvent,
  generateRandomPlaylistId,
  generateRandomIndex,
  generateRandomPlaylistInfo,
  parseSession
};

// assuming average range needed is 120000 hits

// Monday - 120000
// Tuesday - 90000
// Wednesday - 105000
// Thursday - 120000
// Friday - 150000
// Saturday - 180000
// Sunday - 120000

// average searches a day (16%)
// average about playlist hits a day (25%)
// average about songs responses per day (50%)
// average about songs reactions per day (9%)

