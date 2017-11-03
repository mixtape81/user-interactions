// **** startDate **** new Date('2017-08-01T10:00:06.420Z').toISOString() ***** 10 am UTC**** //

const startInMilliseconds = 1493632800000; // 10 am UTC in milliseconds
const timeToday = 1509661839005; // Nov 2  3:30 pm PDT


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
  1: 180, // 100000
  2: 170, // 45980 // 90000
  3: 200, // 53856 // 105000  // 71248
  4: 248, // 64245 // 110000
  5: 290, // 70763 // 150000
  6: 360, // 74842 // 180000
  0: 160 // 120000
};

// random addtional count for sessions
const generateCountForSessions = () => Math.ceil(Math.random() * 5);

// generate random number between 1 - 5
const generateOneToThree = () => Math.ceil(Math.random() * 3);

// random index between 0 & 1
const generateRandomIndex = () => Math.floor(Math.random() * 2);

// random genre id
const generateRandomGenreId = () => Math.floor(Math.random() * 10) + 1;

// generates a random song id
const generateRandomSongId = () => Math.floor(Math.random() * 100000) + 1;

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

const getTimeDetails = (timestamp) => {
  const time = new Date(timestamp + (420 * 60000));
  const day = time.getDay();
  const date = time.getDate();
  const hour = time.getHours();
  const minutes = time.getMinutes();
  return {
    time, day, date, hour, minutes
  };
};

const averageSessionsPerDay = (timeStamp) => {
  const { hour, day, minutes } = getTimeDetails(timeStamp);
  const previous = dayEstimates[day];
  let sessions = dayEstimates[day];
  if ((hour >= 1 && hour <= 7) || hour === 23 || hour === 0) {
    if (hour === 23 && minutes <= 20 && minutes >= 0) {
      sessions = 3 * generateCountForSessions();
    } else if (hour === 23 && minutes >= 21 && minutes <= 40) {
      sessions = 2 * generateCountForSessions();
    } else if (hour === 23 && minutes >= 40 && minutes <= 59) {
      sessions = 1 * generateCountForSessions();
    } else if (hour === 7) {
      if (minutes >= 0 && minutes <= 20) {
        sessions = Math.floor(dayEstimates[day] / 2);
      } else if (minutes >= 21 && minutes <= 40) {
        sessions = dayEstimates[day];
      } else if (minutes >= 41 && minutes <= 59) {
        sessions = dayEstimates[day] * 2;
      }
    } else {
      sessions = Math.floor(Math.random() * 30);
    }
  } else if (hour >= 8 && hour <= 11) {
    sessions = dayEstimates[day] * generateCountForSessions();
  } else if (hour >= 12 && hour <= 16) {
    sessions = Math.floor(dayEstimates[day] / generateOneToThree());
  } else if (hour >= 17 && hour <= 20) {
    sessions = Math.ceil(dayEstimates[day] * 2);
  } else if (hour >= 21 && hour < 23) {
    sessions = dayEstimates[day];
  }
  sessions = sessions < 0 ? 1 : sessions;
  const variation = generateRandomIndex();
  const random = generateCountForSessions();
  const value = variation ? Math.floor(previous + (random * 2)) : (previous - random);
  dayEstimates[day] = value < 1 ? value * -1 : value;
  console.log('number of sessions to generate', sessions);
  return sessions;
};

const eventProbabilites = (n) => {
  console.log('n', n);
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
  }
  return null;
};

const playlistProbabilities = (n) => {
  // TODO: implement probability for playlists
};

const genreProbabilities = (n) => {
  // TODO: implement genre probablity
};

const parseDate = (date) => {
  // console.log('here with date', date);
  const variation = generateRandomIndex();
  const createdAt = variation ? date + generateRandomSeconds(100, 10000)
    : date - generateRandomSeconds(100, 10000);
  const parsed = new Date(Number(createdAt)).toISOString();
  return { date: parsed.match(/\d+-\d+-\d+/)[0], createdAt: `${createdAt}` };
};

const generateRandomPlaylistInfo = () => {
  const genre = generateRandomGenreId();
  const genrePlaylists = playlists[genre];
  const playlist = genrePlaylists[generateRandomIndex()];
  return { genre, playlist };
};

module.exports = {
  genres,
  generateRandomGenreId,
  generateRandomSongId,
  generateRandomSearch,
  generateRandomUserId,
  generateBoolean,
  generateRandomEvent,
  generateRandomPlaylistId,
  generateRandomPlaylistInfo,
  parseSession,
  eventProbabilites,
  generateRandomSeconds,
  generateRandomMilliseconds,
  startInMilliseconds,
  parseDate,
  dayEstimates,
  averageSessionsPerDay
};
