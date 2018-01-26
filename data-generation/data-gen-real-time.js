const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const files = require('./files-index');
const helpers = require('./data-helpers-real-time.js');
const queries = require('./data-queries.js');

let count = 0;
let usersWithSessions;
const currentTime = Date.now();
let lastTimeStamp = currentTime;
let lastSession = `0--null--${currentTime}--${currentTime + (58 * 60000)}`;
let addTime;
let lastEntry;
let lastTimeStampPerRound;


// generate log object for elasticsearch
// const generateLog = (date, session, event) => {
//   const obj = {
//     user_id: Number(session[1]),
//     sessionId: Number(session[0]),
//     eventTypeId: event,
//     date: date.date,
//     createdAt: date.createdAt
//   };
//   return `${files.index}\n${JSON.stringify(obj)}\n`;
// };

// this function updates logs
// const updateLogs = (json, sql) => (
//   fs.appendFileAsync(files.logs, sql)
//     .then(() => fs.appendFileAsync(files.logsJSON, json))
// );

const updateUserSessions = () => {
  const users = [];
  usersWithSessions.forEach(user => users.push(user));
  return fs.writeFileAsync(files.currentUsers, users);
};

// this function updates the files with the event info 
// const updateFiles = (jsonFile, sqlFile, json, sql, event) => {
//   return updateUserSessions()
//     .then(() => fs.appendFileAsync(jsonFile, json))
//     .then(() => fs.appendFileAsync(sqlFile, sql))
//     .then(() => (checkEntriesCount() && addToDB ? queries.updateDatabase() : null))
//     .catch(err => console.log(`error updating database in ${event}`, err));
// };


// this function triggers a playlist view
const triggerPlaylistView = (session) => {
  const list = helpers.generateRandomPlaylistInfo();
  const date = helpers.parseDate(Number(session[2]));
  const view = {
    playlistId: list.playlist,
    genreId: list.genre,
    date: date.date,
    createdAt: date.createdAt,
    sessionId: Number(session[0]),
    userId: Number(session[1]),
    eventId: 1
  };
  return updateUserSessions()
    .then(() => queries.sendToServer('playlistview', view))
    .catch(() => console.log('error adding playlist view'));
};

// this function triggers a genre searched
const triggerSearch = (session) => {
  const value = helpers.generateRandomSearch();
  const date = helpers.parseDate(Number(session[2]));
  const search = {
    value,
    date: date.date,
    createdAt: date.createdAt,
    sessionId: Number(session[0]),
    userId: Number(session[1]),
    eventId: 2
  };

  return updateUserSessions()
    .then(() => queries.sendToServer('search', search))
    .catch(() => console.log('error adding playlist view'));
};

// this function triggers a song reaction (liked/disliked)
const triggerSongReaction = (session) => {
  const list = helpers.generateRandomPlaylistInfo();
  const date = helpers.parseDate(Number(session[2]));
  const songReaction = {
    liked: helpers.generateBoolean(),
    songId: helpers.generateRandomSongId(),
    playlistId: list.playlist,
    genreId: list.playlist,
    date: date.date,
    createdAt: date.createdAt,
    sessionId: Number(session[0]),
    userId: Number(session[1]),
    eventId: 3
  };

  return updateUserSessions()
    .then(() => queries.sendToServer('songreaction', songReaction))
    .catch(() => console.log('error adding playlist view'));
};

// this function triggers a song response (heard/skippeds)
const triggerSongResponse = (session) => {
  const list = helpers.generateRandomPlaylistInfo();
  const date = helpers.parseDate(Number(session[2]));
  const songResponse = {
    listenedTo: helpers.generateBoolean(),
    songId: helpers.generateRandomSongId(),
    playlistId: list.playlist,
    genreId: list.playlist,
    date: date.date,
    createdAt: date.createdAt,
    sessionId: Number(session[0]),
    userId: Number(session[1]),
    eventId: 4
  };

  return updateUserSessions()
    .then(() => queries.sendToServer('songresponse', songResponse))
    .catch(() => console.log('error adding playlist view'));
};

// this function will initiate a trigger for a specific event for each session
const triggerEventsOnSessions = (sessionsToTrigger) => {
  const events = {
    skip: (() => {}),
    playlistView: triggerPlaylistView,
    search: triggerSearch,
    songReaction: triggerSongReaction,
    songResponse: triggerSongResponse
  };

  if (sessionsToTrigger.length > 250) {
    sessionsToTrigger.length = 250;
  }
  console.log('number of sessions to trigger is', sessionsToTrigger.length);
 
  sessionsToTrigger.forEach((session) => {
    const event = helpers.eventProbabilites(helpers.generateRandomEvent());
    events[event](helpers.parseSession(session));
    // events.songResponse(helpers.parseSession(session));
    
  });
};

// this function writes current sessions to sessions.txt
const archiveSessions = (active) => {
  return fs.truncateAsync(files.currentSessions)
    .then(() => fs.writeFileAsync(files.currentSessions, active))
    .then(() => triggerEventsOnSessions(active))
    .then(() => {
      count++;
      console.log('Count after this round is', count);
      setTimeout(() => {
        runScript();
      }, 1000);
    })
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
  let timeStamp = Date.now();
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
  let start = timeStamp + helpers.generateRandomSeconds(5000, 20000);
  const sessionsToGenerate = 15;
  // helpers.averageSessionsPerDay(start);
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
  lastTimeStampPerRound = lastTimeStamp + helpers.generateRandomSeconds(5000, 10000);
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
  fs.readFileAsync(files.currentUsers)
    .then(users => getUsers(users ? users.toString() : null))
    .then(() => fs.readFileAsync(files.currentSessions))
    .then(sessions => findActiveSessions(sessions ? sessions.toString() : null))
    .catch(err => console.log('error reading sessions file', err));
};

const runScript = () => {
  getSessions();
};

runScript();

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
