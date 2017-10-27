const fs = require('fs');
const path = require('path');
const constants = require('./data-gen-constants.js');
const queries = require('./queries.js');

let addTime;
let lastTimeStamp = constants.startInMilliseconds;
let lastTimeStampPerRound;
let round = 1;

// this function triggers a playlist view
const triggerPlaylistView = (session) => {
  // console.log('triggered playlist view with session', session);
  const list = constants.generateRandomPlaylistInfo();
  const date = constants.parseDate(lastTimeStamp);
  const query = {
    user_id: session[1],
    sessionId: session[0],
    eventTypeId: 1,
    playlist_id: list.playlist,
    genre_id: list.genre,
    date: date.date,
    createdAt: date.createdAt
  };
  return queries.addToLogs(query)
    .then((log) => {
      query.logId = log.id;
      return queries.addToPlaylistView(query);
    })
    .catch(err => console.log('error adding view from generator', err));
};

// this function triggers a genre searched
const triggerSearch = (session) => {
  // console.log('triggered search with session', session);
  const value = constants.genres[constants.generateRandomGenreId() - 1];
  const date = constants.parseDate(lastTimeStamp);
  const query = {
    value,
    user_id: session[1],
    sessionId: session[0],
    eventTypeId: 2,
    date: date.date,
    createdAt: date.createdAt
  };
  return queries.addToLogs(query)
    .then((log) => {
      query.logId = log.id;
      return queries.addToSearch(query);
    })
    .catch(err => console.log('error adding search from generator', err));
};

// this function triggers a song reaction (liked/disliked)
const triggerSongReaction = (session) => {
  // console.log('triggered song reaction with session', session);
  const list = constants.generateRandomPlaylistInfo();
  const date = constants.parseDate(lastTimeStamp);
  const songReaction = {
    liked: constants.generateBoolean(),
    song_id: constants.generateRandomSongId(),
    playlist_id: list.playlist,
    user_id: session[1],
    sessionId: session[0],
    eventTypeId: 3,
    genre_id: list.playlist,
    date: date.date,
    createdAt: date.createdAt
  };

  return queries.addToLogs(songReaction)
    .then((log) => {
      songReaction.logId = log.id;
      return queries.addToSongReactions(songReaction);
    })
    .catch(err => console.log('error adding song reaction from generator', err));
};


// this function triggers a song response (heard/skippeds)
const triggerSongResponse = (session) => {
  // console.log('triggered song response with session', session);
  const list = constants.generateRandomPlaylistInfo();
  const date = constants.parseDate(lastTimeStamp);
  const songResponse = {
    listenedTo: constants.generateBoolean(),
    song_id: constants.generateRandomSongId(),
    playlist_id: list.playlist,
    user_id: session[1],
    sessionId: session[0],
    eventTypeId: 4,
    genre_id: list.playlist,
    date: date.date,
    createdAt: date.createdAt
  };
  // console.log('song response body', songResponse);

  return queries.addToLogs(songResponse)
    .then((log) => {
      songResponse.logId = log.id;
      return queries.addToSongResponses(songResponse);
    })
    .catch(err => console.log('error adding song response from generator', err));
};

const triggerSkip = (session) => {
  // console.log('triggered skip for this session', session);
};

// this function will initiate a trigger for a specific event for each session
const triggerEventsOnSessions = (sessionsToTrigger) => {
  const events = {
    skip: triggerSkip,
    playlistView: triggerPlaylistView,
    search: triggerSearch,
    songReaction: triggerSongReaction,
    songResponse: triggerSongResponse
  };
  sessionsToTrigger.forEach((session) => {
    const event = constants.eventProbabilites(constants.generateRandomEvent());
    events[event](constants.parseSession(session));
  });
};

// this function writes current sessions to sessions.txt
const archiveSessions = (active, endpoint = './sessions.txt') => {
  const file = path.join(__dirname, endpoint);
  fs.truncate(file, (err) => {
    if (err) {
      console.log('error truncating file', err);
    } else {
      fs.writeFile(file, active, (error) => {
        if (err) {
          console.log('error writing files', error);
        }
      });
    }
  });
};

// this function generates a random end time for each session based on
// its start time (limit: 60 mins)
const generateRandomEndTime = (start) => {
  const sessionTime = Math.floor(Math.random() * 120) * 60000;
  const time = start + addTime;
  return time + sessionTime;
};

// this session adds a random milliseconds to session starts to keep them more unique
const addRandomTime = () => {
  addTime = Math.floor(Math.random() * 10000);
  return addTime;
};

// this function creates 500 random users each time it runs
const generateRandomSessions = ({ timeStamp, sessionId }) => {
  let start = timeStamp + constants.generateRandomSeconds(100000, 200000);
  const sessionsToGenerate = constants.averageSessionsPerDay(timeStamp) + Math.floor(Math.random() * 4);
  const sessions = [];
  for (let i = 0; i < sessionsToGenerate; i += 1) {
    const user = constants.generateRandomUserId();
    if (!constants.usersWithSessions[user]) {
      sessions.push(`${sessionId + 1}--${user}--${start + addRandomTime()}--${generateRandomEndTime(start)}`);
      start = start + addTime + constants.generateRandomSeconds(100, 1000);
      constants.usersWithSessions[user] = true;
    }
    sessionId += 1;
    lastTimeStamp = start;
  }
  lastTimeStampPerRound = start;
  return sessions;
};

const getLastTimeStampAndSessionId = (session) => {
  let sessionId = 0;
  let timeStamp = constants.startInMilliseconds;
  const sessionDetails = session ? session.match(/\d+/g) : null;
  if (sessionDetails) {
    timeStamp = Number(sessionDetails[2]);
    sessionId = Number(sessionDetails[0]);
    lastTimeStamp = timeStamp;
    lastTimeStampPerRound = timeStamp;
  }
  return { timeStamp, sessionId };
};

// this function finds all the active sessions, and then passes them to triggerEvents.
const findActiveSessions = (sessions) => {
  let active = sessions ? sessions.split(',') : [];
  const lastEntry = getLastTimeStampAndSessionId(active[active.length - 1]);
  active = active.filter(session => (Number(session.match(/\d+/g)[3])) > lastTimeStampPerRound);
  const newSessions = generateRandomSessions(lastEntry);
  active = active.concat(newSessions);
  archiveSessions(active);
  triggerEventsOnSessions(active);
};

const getSessions = () => {
  fs.readFile(path.join(__dirname, '/sessions.txt'), (err, data) => {
    if (err) {
      console.log('error reading sessions file', err);
    } else {
      findActiveSessions(data ? data.toString() : null);
    }
  });
};

let catchUpTillDate;

const checkTimeForNow = (time) => {
  if (time > Date.now()) {
    clearInterval(catchUpTillDate);
    process.exit();
  } else {
    console.log(`round number - ${round}`);
    console.log('last time stamp per round', lastTimeStampPerRound ? new Date(lastTimeStampPerRound).toISOString() : undefined);
    round += 1;
    getSessions();
  }
};

const addMockData = () => {
  catchUpTillDate = setInterval(() => {
    checkTimeForNow(lastTimeStamp);
  }, constants.generateRandomSeconds(1000, 2500));
};

addMockData();

module.exports = {
  generateRandomSessions,
  generateRandomEndTime,
  getSessions,
  findActiveSessions,
  triggerEventsOnSessions,
  archiveSessions,
  triggerPlaylistView,
  triggerSearch,
  triggerSongReaction,
  triggerSongResponse,
  getLastTimeStampAndSessionId
};
