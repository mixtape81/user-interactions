const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const files = require('./files-index');
const helpers = require('./data-helpers.js');
const updateDatabase = require('./database-query');
const { addDocumentsinBulk } = require('../elasticsearch/queries.js');

let catchUpTillDate;
let lastSession = `0--null--${helpers.startInMilliseconds}--${helpers.startInMilliseconds + (58 * 60000)}`;
let addTime;
let lastEntry;
let lastTimeStamp = helpers.startInMilliseconds;
let lastTimeStampPerRound;
let round = 1;
let logId = 1;
let count = 0;

const checkEntriesCount = () => {
  if (count > 10000) {
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

const feedElasticSearch = () => {
  console.log('CAME TO FEED ELASTIC SEARCH');
  fs.readFileAsync(files.logsJSON)
    .then((data) => {
      console.log('ELASTIC SEARCH DATA LENGTH', (data.toString().split('\n').length));
      addDocumentsinBulk('mixtapetest', 'logs', data.toString());
    })
    .then(() => fs.truncate(files.logsJSON))
    .catch(err => console.log('in data generater after adding to elastic error', err));
};

// this function updates logs
const updateLogs = (json, sql) => (
  fs.appendFileAsync(files.logs, sql)
    .then(() => fs.appendFileAsync(files.logsJSON, json))
);

const udpateConstants = () => {
  const values = JSON.stringify(helpers.usersWithSessions);
  return fs.writeFileAsync(files.constants, values);
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

  const logJSON = generateLog(date, session, 1);
  const viewJSON = `${files.index}\n${JSON.stringify(view)}\n`;
  const viewSQL = `(${list.playlist}, ${list.genre}, '${date.date}', ${date.createdAt}, ${logId}),\n`;
  const logSQL = `(${Number(session[1])}, '${date.date}', ${date.createdAt}, 1, ${Number(session[0])}),\n`;

  logId += 1;

  updateLogs(logJSON, logSQL)
    .then(() => udpateConstants())
    .then(() => fs.appendFileAsync(files.playlistViews, viewSQL))
    .then(() => fs.appendFileAsync(files.playlistViewsJSON, viewJSON))
    .then(() => (checkEntriesCount() ? updateDatabase() : null))
    .then(value => (value ? feedElasticSearch() : null))
    .catch(err => console.log('error updating database in play list views', err));
};

// this function triggers a genre searched
const triggerSearch = (session) => {
  const value = helpers.genres[helpers.generateRandomGenreId() - 1];
  const date = helpers.parseDate(Number(session[2]));

  const search = {
    value,
    date: date.date,
    createdAt: date.createdAt,
    logId
  };

  const logJSON = generateLog(date, session, 2);
  const searchJSON = `${files.index}\n${JSON.stringify(search)}\n`;
  const searchSQL = `('${value}','${date.date}', ${date.createdAt}, ${logId}),\n`;
  const logSQL = `(${Number(session[1])}, '${date.date}', ${date.createdAt}, 2, ${Number(session[0])}),\n`;

  logId += 1;

  updateLogs(logJSON, logSQL)
    .then(() => udpateConstants())
    .then(() => fs.appendFileAsync(files.searches, searchSQL))
    .then(() => fs.appendFileAsync(files.searchesJSON, searchJSON))
    .then(() => (checkEntriesCount() ? updateDatabase() : null))
    .then(value => (value ? feedElasticSearch() : null))
    .catch(err => console.log('error updating database in search', err));
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

  const logJSON = generateLog(date, session, 3);
  const songReactionJSON = `${files.index}\n${JSON.stringify(songReaction)}\n`;
  const songReactionSQL = `(${helpers.generateRandomSongId()}, ${helpers.generateBoolean()}, ${list.playlist}, ${list.genre}, '${date.date}', ${date.createdAt}, ${logId}),\n`;
  const logSQL = `(${Number(session[1])},'${date.date}', ${date.createdAt}, 3, ${Number(session[0])}),\n`;

  logId += 1;

  updateLogs(logJSON, logSQL)
    .then(() => udpateConstants())
    .then(() => fs.appendFileAsync(files.songReactions, songReactionSQL))
    .then(() => fs.appendFileAsync(files.songReactionsJSON, songReactionJSON))
    .then(() => (checkEntriesCount() ? updateDatabase() : null))
    .then(value => (value ? feedElasticSearch() : null))
    .catch(err => console.log('error updating database in song reaction', err));
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

  const logJSON = generateLog(date, session, 4);
  const songResponseJSON = `${files.index}\n${JSON.stringify(songResponse)}\n`;
  const songResponseSQL = `(${helpers.generateRandomSongId()}, ${helpers.generateBoolean()}, ${list.playlist}, ${list.genre}, '${date.date}', ${date.createdAt}, ${logId}),\n`;
  const logSQL = `(${Number(session[1])}, '${date.date}', ${date.createdAt}, 4, ${Number(session[0])}),\n`;

  logId += 1;

  updateLogs(logJSON, logSQL)
    .then(() => udpateConstants())
    .then(() => fs.appendFileAsync(files.songResponses, songResponseSQL))
    .then(() => fs.appendFileAsync(files.songResponsesJSON, songResponseJSON))
    .then(() => (checkEntriesCount() ? updateDatabase() : null))
    .then(value => (value ? feedElasticSearch() : null))
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
    const event = helpers.eventProbabilites(helpers.generateRandomEvent());
    events[event](helpers.parseSession(session));
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
  let start = timeStamp + helpers.generateRandomSeconds(50000, 200000);
  const sessionsToGenerate = helpers.averageSessionsPerDay(timeStamp);
  // console.log('sessions to create', sessionsToGenerate);
  const sessions = [];
  for (let i = 0; i < sessionsToGenerate; i += 1) {
    const user = helpers.generateRandomUserId();
    if (!helpers.usersWithSessions[user]) {
      sessions.push(`${sessionId + 1}--${user}--${start + addRandomTime()}--${generateRandomEndTime(start)}`);
      start = start + addTime + helpers.generateRandomSeconds(100, 1000);
      helpers.usersWithSessions[user] = true;
    }

    sessionId += 1;
    lastTimeStamp = start;
  }
  // console.log('sessions generated', sessions.length);
  lastTimeStampPerRound = start + helpers.generateRandomSeconds(5000, 150000);
  lastSession = sessions.length ? sessions[sessions.length - 1] : lastSession;
  return sessions;
};


const generateAndProcessSessions = (active) => {
  lastEntry = getLastTimeStampAndSessionId(active[active.length - 1]) || lastSession;
  const newSessions = generateRandomSessions(lastEntry);
  archiveSessions(active.concat(newSessions));
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
    delete helpers.usersWithSessions[details[1]];
  });
  generateAndProcessSessions(active);
};

const assignConstants = (values) => {
  const constants = values ? JSON.parse(values) : [];
  helpers.usersWithSessions = constants[1] || {};
};

const getSessions = () => {
  fs.readFileAsync(files.constants)
    .then(constants => assignConstants(constants ? constants.toString() : null))
    .then(() => fs.readFileAsync(files.sessions))
    .then(sessions => findActiveSessions(sessions ? sessions.toString() : null))
    .catch(err => console.log('error reading sessions file', err));
};


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
  const interval = 200;
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
