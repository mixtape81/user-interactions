const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const files = require('./files-index');
const constants = require('./data-gen-constants.js');
const updateDatabase = require('./database-query');

let catchUpTillDate;
let lastSession = `0--null--${constants.startInMilliseconds}--${constants.startInMilliseconds + (58 * 60000)}`;
let addTime;
let lastEntry;
let lastTimeStamp = constants.startInMilliseconds;
let lastTimeStampPerRound;
let round = 1;
let logId = 1;

const checkEntriesCount = () => logId % 100000 === 0;

// this function triggers a playlist view
const triggerPlaylistView = (session) => {
  const list = constants.generateRandomPlaylistInfo();
  const date = constants.parseDate(Number(session[2]));

  const event = {
    playlist_id: list.playlist,
    genre_id: list.genre,
    date: date.date,
    createdAt: date.createdAt,
    logId
  };

  const log = {
    user_id: Number(session[1]),
    sessionId: Number(session[0]),
    eventTypeId: 1,
    date: date.date,
    createdAt: date.createdAt
    // logId
  };

  const viewJSON = `${files.index}\n${JSON.stringify(event)}\n`;
  const logJSON = `${files.index}\n${JSON.stringify(log)}\n`;
  const viewSQL = `(${list.playlist}, ${list.genre}, '${date.date}', ${date.createdAt}, ${logId}),\n`;
  const logSQL = `(${Number(session[1])}, '${date.date}', ${date.createdAt}, 1, ${Number(session[0])}),\n`;

  let reachedCount = false;
  if (checkEntriesCount()) {
    reachedCount = true;
  }

  logId += 1;

  fs.appendFileAsync(files.logs, logSQL)
    .then(() => fs.appendFileAsync(files.logsJSON, logJSON))
    .then(() => fs.appendFileAsync(files.playlistViews, viewSQL))
    .then(() => fs.appendFileAsync(files.playlistViewsJSON, viewJSON))
    .then(() => {
      if (reachedCount) {
        reachedCount = false;
        return updateDatabase();
      }
      return null;
    })
    .catch(err => console.log('error updating database in play list views', err));
};

// this function triggers a genre searched
const triggerSearch = (session) => {
  const value = constants.genres[constants.generateRandomGenreId() - 1];
  const date = constants.parseDate(Number(session[2]));
  const search = {
    value,
    date: date.date,
    createdAt: date.createdAt,
    logId
  };

  const log = {
    user_id: Number(session[1]),
    sessionId: Number(session[0]),
    eventTypeId: 2,
    date: date.date,
    createdAt: date.createdAt
    // logId
  };

  const searchJSON = `${files.index}\n${JSON.stringify(search)}\n`;
  const logJSON = `${files.index}\n${JSON.stringify(log)}\n`;
  const searchSQL = `('${value}','${date.date}', ${date.createdAt}, ${logId}),\n`;
  const logSQL = `(${Number(session[1])}, '${date.date}', ${date.createdAt}, 2, ${Number(session[0])}),\n`;

  let reachedCount = false;
  if (checkEntriesCount()) {
    reachedCount = true;
  }

  logId += 1;

  fs.appendFileAsync(files.logs, logSQL)
    .then(() => fs.appendFileAsync(files.logsJSON, logJSON))
    .then(() => fs.appendFileAsync(files.searches, searchSQL))
    .then(() => fs.appendFileAsync(files.searchesJSON, searchJSON))
    .then(() => {
      if (reachedCount) {
        reachedCount = false;
        return updateDatabase();
      }
      return null;
    })
    .catch(err => console.log('error updating database in search', err));
};


// this function triggers a song reaction (liked/disliked)
const triggerSongReaction = (session) => {
  const list = constants.generateRandomPlaylistInfo();
  const date = constants.parseDate(Number(session[2]));
  const songReaction = {
    liked: constants.generateBoolean(),
    song_id: constants.generateRandomSongId(),
    playlist_id: list.playlist,
    genre_id: list.playlist,
    date: date.date,
    createdAt: date.createdAt,
    logId
  };

  const log = {
    user_id: Number(session[1]),
    sessionId: Number(session[0]),
    eventTypeId: 3,
    date: date.date,
    createdAt: date.createdAt
    // logId
  };

  const songReactionJSON = `${files.index}\n${JSON.stringify(songReaction)}\n`;
  const logJSON = `${files.index}\n${JSON.stringify(log)}\n`;
  const songReactionSQL = `(${constants.generateRandomSongId()}, ${constants.generateBoolean()}, ${list.playlist}, ${list.genre}, '${date.date}', ${date.createdAt}, ${logId}),\n`;
  const logSQL = `(${Number(session[1])},'${date.date}', ${date.createdAt}, 3, ${Number(session[0])}),\n`;

  let reachedCount = false;
  if (checkEntriesCount()) {
    reachedCount = true;
  }

  logId += 1;

  fs.appendFileAsync(files.logs, logSQL)
    .then(() => fs.appendFileAsync(files.logsJSON, logJSON))
    .then(() => fs.appendFileAsync(files.songReactions, songReactionSQL))
    .then(() => fs.appendFileAsync(files.songReactionsJSON, songReactionJSON))
    .then(() => {
      if (reachedCount) {
        reachedCount = false;
        return updateDatabase();
      }
      return null;
    })
    .catch(err => console.log('error updating database in song reaction', err));
};


// this function triggers a song response (heard/skippeds)
const triggerSongResponse = (session) => {
  const list = constants.generateRandomPlaylistInfo();
  const date = constants.parseDate(Number(session[2]));
  const songResponse = {
    listenedTo: constants.generateBoolean(),
    song_id: constants.generateRandomSongId(),
    playlist_id: list.playlist,
    genre_id: list.playlist,
    date: date.date,
    createdAt: date.createdAt,
    logId
  };

  const log = {
    user_id: Number(session[1]),
    sessionId: Number(session[0]),
    eventTypeId: 4,
    date: date.date,
    createdAt: date.createdAt
    // logId
  };

  const songResponseJSON = `${files.index}\n${JSON.stringify(songResponse)}\n`;
  const logJSON = `${files.index}\n${JSON.stringify(log)}\n`;
  const songResponseSQL = `(${constants.generateRandomSongId()}, ${constants.generateBoolean()}, ${list.playlist}, ${list.genre}, '${date.date}', ${date.createdAt}, ${logId}),\n`;
  const logSQL = `(${Number(session[1])}, '${date.date}', ${date.createdAt}, 4, ${Number(session[0])}),\n`;

  let reachedCount = false;
  if (checkEntriesCount()) {
    reachedCount = true;
  }

  logId += 1;

  fs.appendFileAsync(files.logs, logSQL)
    .then(() => fs.appendFileAsync(files.logsJSON, logJSON))
    .then(() => fs.appendFileAsync(files.songResponses, songResponseSQL))
    .then(() => fs.appendFileAsync(files.songResponsesJSON, songResponseJSON))
    .then(() => {
      if (reachedCount) {
        reachedCount = false;
        return updateDatabase();
      }
      return null;
    })
    .catch(err => console.log('error updating database in song response', err));
};

const triggerSkip = () => {
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
const archiveSessions = (active) => {
  fs.truncateAsync(files.sessions)
    .then(() => fs.writeFileAsync(files.sessions, active))
    .then(() => triggerEventsOnSessions(active))
    .catch(err => console.log('error archiving sessions', err));
};



// this function generates a random end time for each session based on
// start time (limit: 120 mins)
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


const getLastTimeStampAndSessionId = (session = lastSession) => {
  let sessionId = 0;
  let timeStamp = constants.startInMilliseconds;
  const details = session ? constants.parseSession(session) : null;
  if (details) {
    timeStamp = Number(details[2]);
    sessionId = Number(details[0]);
    lastTimeStamp = timeStamp;
    lastTimeStampPerRound = timeStamp;
  }
  return { timeStamp, sessionId };
};


// this function creates 500 random users each time it runs
const generateRandomSessions = ({ timeStamp, sessionId }) => {
  let start = timeStamp + constants.generateRandomSeconds(50000, 200000);
  const sessionsToGenerate = constants.averageSessionsPerDay(timeStamp);
  // console.log('sessions to create', sessionsToGenerate);
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
  // console.log('sessions generated', sessions.length);
  lastTimeStampPerRound = start + constants.generateRandomSeconds(5000, 150000);
  lastSession = sessions[sessions.length - 1] || lastSession;
  return sessions;
};


const generateAndProcessSessions = (active) => {
  lastEntry = getLastTimeStampAndSessionId(active[active.length - 1]) || lastSession;
  const newSessions = generateRandomSessions(lastEntry);
  active = active.concat(newSessions);
  archiveSessions(active);
};



// this function finds all the active sessions, and then passes them to triggerEvents.
const findActiveSessions = (sessions) => {
  const inactive = [];
  let active = sessions ? sessions.split(',') : [];
  active = active.filter((session) => {
    if (Number(session.match(/\d+/g)[3]) < lastTimeStampPerRound) {
      inactive.push(session);
      return false;
    }
    return true;
  });

  inactive.forEach((session) => {
    const details = constants.parseSession(session);
    delete constants.usersWithSessions[details[1]];
  });
  // console.log('all active sessions', active.length);
  generateAndProcessSessions(active);
};



const getSessions = () => {
  fs.readFileAsync(files.sessions)
    .then(sessions => findActiveSessions(sessions ? sessions.toString() : null))
    .catch(err => console.log('error reading sessions file', err));
};



const checkTimeForNow = (time) => {
  // if (logId === 10000) {
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
  const interval = 150;
  catchUpTillDate = setInterval(() => {
    checkTimeForNow(lastTimeStamp);
  }, interval);
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