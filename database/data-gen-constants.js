const usersWithSessions = {};
const startDate = new Date('2017-08-01T10:00:06.420Z').toISOString(); // 10 am UTC;
const startInMilliseconds = 1501581638000;
// 1501977605972 2017-08-06T00:03:49.943Z
// 1501977605972
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


const dayEstimates = {
  1: 52, // 100000
  2: 45, // 45980 // 90000
  3: 55, // 53856 // 105000  // 71248
  4: 60, // 64245 // 110000 
  5: 75, // 70763 // 150000
  6: 70, // 74842 // 180000
  0: 56  // 120000
};

// random index between 0 & 1
const generateRandomIndex = () => Math.floor(Math.random() * 2);

// random count of sessions to generate
const generateRandomSessionCount = () => Math.floor(Math.random() * 20) + 1;

// random genre id
const generateRandomGenreId = () => Math.floor(Math.random() * 10) + 1;

// generates a random song id
const generateRandomSongId = () => Math.floor(Math.random() * 10000) + 1;

// generate random genre to search for
const generateRandomSearch = () => genres[Math.floor(Math.random() * 10)];

// this function generates a boolean
const generateBoolean = () => [true, false][Math.floor(Math.random() * 2)];

// this function generates a random possbile event
const generateRandomEvent = () => Math.floor(Math.random() * 100) + 1;

// this function parses the session and returns an array of the differnt values
const parseSession = session => session.match(/\d+/g);

// this function generates a random playlist id
const generateRandomPlaylistId = () => Math.floor(Math.random() * 20) + 1;

// this function generates a random user id
const generateRandomUserId = () => Math.floor(Math.random() * 25000) + 1;

// this function generates random number of seconds to increment
const generateRandomSeconds = (start, end) => Math.floor(Math.random() * (end - start)) + start;

const generateRandomMilliseconds = () => Math.floor(Math.random() * 100) + 1;

const averageSessionsPerDay = (timeStamp) => {
  const day = new Date(timeStamp + (420 * 60000)).getDay();
  // console.log('timestamp', timeStamp);
  // const time = new Date(timeStamp + (420 * 60000));
  const sessions = dayEstimates[day];
  // const hours = time.getHours();
  // if (hours >= 1 && hours <= 8 || hours === 23 || hours === 0) {
  //   sessions = 3;
  // } else if (hours >= 8 && hours <= 11){
  //   const sessions = dayEstimates[day] / 2;
  // }
  const variation = [true, false][generateRandomIndex()];
  // console.log('variations', variation);
  const random = Math.floor(Math.random() * 3);
  dayEstimates[day] = variation ? sessions + random : (sessions - random || 1);
  console.log('day dayEstimates', dayEstimates);
  return sessions;
};

const eventProbabilites = (n) => {
  if (n >= 1 && n <= 5) {
    return 'skip';
  } else if (n >= 6 && n <= 15) {
    return 'search';
  } else if (n >= 16 && n <= 40) {
    return 'playlistView';
  } else if (n >= 41 && n <= 90) {
    return 'songResponse';
  } else if (n >= 91 && n <= 100) {
    return 'songReaction';
  } else {
    throw new Error('Invalid Input');
  }
};

const playlistProbabilities = (n) => {
  // implement probability for playlists
}

const genreProbabilities = (n) => {
  // implement genre probablity
};

const parseDate = (date) => {
  // console.log('here with date', date);
  const variation = [true, false][generateRandomIndex()];
  const createdAt = variation ? date + generateRandomSeconds(100, 10000)
    : date - generateRandomSeconds(100, 10000);
  const parsed = new Date(Number(createdAt)).toISOString();
  return { date: parsed.match(/\d+-\d+-\d+/)[0], createdAt: createdAt };
};

const generateRandomPlaylistInfo = () => {
  const genre = generateRandomGenreId();
  const genrePlaylists = playlists[genre];
  const playlist = genrePlaylists[generateRandomIndex()];
  return { genre, playlist };
};

module.exports = {
  usersWithSessions,
  startDate,
  genres,
  playlists,
  generateRandomGenreId,
  generateRandomSongId,
  generateRandomSearch,
  generateRandomUserId,
  generateBoolean,
  generateRandomEvent,
  generateRandomPlaylistId,
  generateRandomIndex,
  generateRandomPlaylistInfo,
  parseSession,
  eventProbabilites,
  generateRandomSeconds,
  generateRandomMilliseconds,
  startInMilliseconds,
  parseDate,
  dayEstimates,
  averageSessionsPerDay,
  generateRandomSessionCount
};
