const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const files = require('./files-index');
const helpers = require('./data-helpers.js');
const queries = require('./data-queries.js');

let usersWithSessions;
let catchUpTillDate;
// let runEveryHour;
let lastSession = `0--null--${helpers.startInMilliseconds}--${helpers.startInMilliseconds + (58 * 60000)}`;
let addTime;
let lastEntry;
let lastTimeStamp = 1509661839005; /* helpers.startInMilliseconds;*/
let lastTimeStampPerRound;
let round = 1;
let logId = 1;
let count = 0;
let limit = 2000;

// check entries count to update database
const checkEntriesCount = () => {
  if (count > limit) {
    count = 1;
    return true;
  }
  count += 1;
  return false;
};

// generate log object for elasticsearch
const generateLog = (date, session, event) => {
  const obj = {
    user_id: Number(session[1]),
    sessionId: Number(session[0]),
    eventTypeId: event,
    date: date.date,
    createdAt: date.createdAt
  };
  return `${files.index}\n${JSON.stringify(obj)}\n`;
};

// this function updates logs
const updateLogs = (json, sql) => (
  fs.appendFileAsync(files.logs, sql)
    .then(() => fs.appendFileAsync(files.logsJSON, json))
);

const updateUserSessions = () => {
  const users = [];
  usersWithSessions.forEach(user => users.push(user));
  return fs.writeFileAsync(files.users, users);
};

// this function updates the files with the event info 
const updateFiles = (jsonFile, sqlFile, json, sql, event) => {
  return updateUserSessions()
    .then(() => fs.appendFileAsync(jsonFile, json))
    .then(() => fs.appendFileAsync(sqlFile, sql))
    // .then(() => queries.updateAWS())
    // .then(() => (checkEntriesCount() ? queries.updateDatabase() : null))
    // .then(() => (checkEntriesCount() ? queries.updateAWS() : null))
    .catch(err => console.log(`error updating database in ${event}`, err));
};


// this function triggers a playlist view
const triggerPlaylistView = (session) => {
  const list = helpers.generateRandomPlaylistInfo();
  const date = helpers.parseDate(Number(session[2]));
  const view = {
    playlist_id: list.playlist,
    genre_id: list.genre,
    date: date.date,
    createdAt: date.createdAt,
    logId
  };
  const json = `${files.index}\n${JSON.stringify(view)}\n`;
  const sql = `(${list.playlist}, ${list.genre}, '${date.date}', ${date.createdAt}, ${logId}),\n`;
  const logSQL = `(${Number(session[1])}, '${date.date}', ${date.createdAt}, 1, ${Number(session[0])}),\n`;
  const logJSON = generateLog(date, session, 1);
  logId += 1;

  return updateLogs(logJSON, logSQL)
    .then(() => updateFiles(files.playlistViewsJSON, files.playlistViews, json, sql, 'playlistviews'));
};

// this function triggers a genre searched
const triggerSearch = (session) => {
  const value = helpers.generateRandomSearch();
  const date = helpers.parseDate(Number(session[2]));
  const search = {
    value,
    date: date.date,
    createdAt: date.createdAt,
    logId
  };
  const json = `${files.index}\n${JSON.stringify(search)}\n`;
  const sql = `('${value}','${date.date}', ${date.createdAt}, ${logId}),\n`;
  const logJSON = generateLog(date, session, 2);
  const logSQL = `(${Number(session[1])}, '${date.date}', ${date.createdAt}, 2, ${Number(session[0])}),\n`;
  logId += 1;

  return updateLogs(logJSON, logSQL)
    .then(() => updateFiles(files.searchesJSON, files.searches, json, sql, 'searches'));
};

// this function triggers a song reaction (liked/disliked)
const triggerSongReaction = (session) => {
  const list = helpers.generateRandomPlaylistInfo();
  const date = helpers.parseDate(Number(session[2]));
  const songReaction = {
    liked: helpers.generateBoolean(),
    song_id: helpers.generateRandomSongId(),
    playlist_id: list.playlist,
    genre_id: list.playlist,
    date: date.date,
    createdAt: date.createdAt,
    logId
  };
  const json = `${files.index}\n${JSON.stringify(songReaction)}\n`;
  const sql = `(${helpers.generateRandomSongId()}, ${helpers.generateBoolean()}, ${list.playlist}, ${list.genre}, '${date.date}', ${date.createdAt}, ${logId}),\n`;
  const logJSON = generateLog(date, session, 3);
  const logSQL = `(${Number(session[1])},'${date.date}', ${date.createdAt}, 3, ${Number(session[0])}),\n`;
  logId += 1;

  return updateLogs(logJSON, logSQL)
    .then(() => updateFiles(files.songReactionsJSON, files.songReactions, json, sql, 'song reactions'));
};

// this function triggers a song response (heard/skippeds)
const triggerSongResponse = (session) => {
  const list = helpers.generateRandomPlaylistInfo();
  const date = helpers.parseDate(Number(session[2]));
  const songResponse = {
    listenedTo: helpers.generateBoolean(),
    song_id: helpers.generateRandomSongId(),
    playlist_id: list.playlist,
    genre_id: list.playlist,
    date: date.date,
    createdAt: date.createdAt,
    logId
  };
  const json = `${files.index}\n${JSON.stringify(songResponse)}\n`;
  const sql = `(${helpers.generateRandomSongId()}, ${helpers.generateBoolean()}, ${list.playlist}, ${list.genre}, '${date.date}', ${date.createdAt}, ${logId}),\n`;
  const logJSON = generateLog(date, session, 4);
  const logSQL = `(${Number(session[1])}, '${date.date}', ${date.createdAt}, 4, ${Number(session[0])}),\n`;
  logId += 1;

  return updateLogs(logJSON, logSQL)
    .then(() => updateFiles(files.songResponsesJSON, files.songResponses, json, sql, 'song responses'));
};

const triggerSkip = () => {
  // do nothing here
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
    const event = helpers.eventProbabilites(helpers.generateRandomEvent());
    events[event](helpers.parseSession(session));
  });

  return queries.updateAWS();
};

// this function writes current sessions to sessions.txt
const archiveSessions = (active) => {
  return fs.truncateAsync(files.sessions)
    .then(() => fs.writeFileAsync(files.sessions, active))
    .then(() => triggerEventsOnSessions(active))
    .catch(err => console.log('error archiving sessions', err));
};

// this function generates a random end time for each session based on
// start time (limit: 120 mins)
const generateRandomEndTime = (start) => {
  const sessionTime = Math.floor((Math.random() * 120)) * 60000;
  const time = start + addTime;
  return time + sessionTime;
};

// this session adds a random milliseconds to session starts to keep them more unique
const addRandomTime = () => {
  addTime = Math.floor(Math.random() * 10000);
  return addTime;
};

// update script with last session details
const getLastTimeStampAndSessionId = (session) => {
  let sessionId = 0;
  let timeStamp = helpers.startInMilliseconds;
  const details = session ? helpers.parseSession(session) : null;
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
  let id = sessionId;
  let start = timeStamp + helpers.generateRandomSeconds(50000, 200000);
  const sessionsToGenerate = helpers.averageSessionsPerDay(start);
  const sessions = [];
  for (let i = 0; i < sessionsToGenerate; i += 1) {
    const user = helpers.generateRandomUserId();
    if (!usersWithSessions.has(user)) {
      sessions.push(`${id + 1}--${user}--${start + addRandomTime()}--${generateRandomEndTime(start)}`);
      start += addTime + helpers.generateRandomSeconds(100, 1000);
      usersWithSessions.add(user);
    }
    id += 1;
    lastTimeStamp = start;
  }
  lastTimeStampPerRound = lastTimeStamp + helpers.generateRandomSeconds(5000, 100000);
  lastSession = sessions.length ? sessions[sessions.length - 1] : lastSession;
  return sessions;
};

// extract last active session before generating new ones
const generateAndProcessSessions = (active) => {
  let current = active.length ? active[active.length - 1] : lastSession;
  if (current.length < 35) {
    active.pop();
    current = lastSession;
  }
  lastEntry = getLastTimeStampAndSessionId(current);
  const newSessions = generateRandomSessions(lastEntry);
  return archiveSessions(active.concat(newSessions))
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
    const details = helpers.parseSession(session);
    usersWithSessions.delete(details[1]);
  });
  generateAndProcessSessions(active);
};

// get users with sessions
const getUsers = (values) => {
  const users = values ? values.split(',') : [];
  usersWithSessions = users.reduce((result, user) => {
    result.add(Number(user));
    return result;
  }, new Set());
};

// get existing sessions before running script again
const getSessions = () => {
  fs.readFileAsync(files.users)
    .then(users => getUsers(users ? users.toString() : null))
    .then(() => fs.readFileAsync(files.sessions))
    .then(sessions => findActiveSessions(sessions ? sessions.toString() : null))
    .catch(err => console.log('error reading sessions file', err));
};

// function to call at every interval
const checkTimeForNow = (time) => {
  if (time > Date.now()) {
    clearInterval(catchUpTillDate);
    queries.updateAWS()
    // queries.updateDatabase()
      .then(() => {
        console.log('last time stamp when time is current is', lastTimeStamp);
        process.exit();
        // runEveryHour = setInterval(() => {
        //   checkTimeForNow(lastTimeStamp)
        // }, 3600000);

      })
      .catch(err => console.log('error while ending script run', err));
  } else {
    console.log(`round number - ${round}`);
    console.log('last time stamp per round', lastTimeStampPerRound ? new Date(lastTimeStampPerRound).toISOString() : undefined);
    console.log('count is ', count);
    round += 1;
    getSessions();
  }
};

// function to start script
const addMockData = () => {
  catchUpTillDate = setInterval(() => {
    checkTimeForNow(lastTimeStamp);
  }, 7000);
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
