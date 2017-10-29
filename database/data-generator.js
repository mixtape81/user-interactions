const fs = require('fs');
const path = require('path');
const constants = require('./data-gen-constants.js');
// const queries = require('./queries.js');

const logFile = path.join(__dirname, './jsons/logs.txt');
const songResponseFile = path.join(__dirname, './jsons/song-responses.txt');
const songReactionFile = path.join(__dirname, './jsons/song-reactions.txt');
const searchFile = path.join(__dirname, './jsons/searches.txt');
const playlistViewFile = path.join(__dirname, './jsons/playlist-views.txt');
const sessionsFile = path.join(__dirname, './jsons/sessions.txt')

let addTime;
let lastEntry;
let lastTimeStamp = constants.startInMilliseconds;
let lastTimeStampPerRound;
// let lastSession = `0--null--${constants.startInMilliseconds}--${constants.startInMilliseconds + (58 * 60000)}`;
let round = 1;
let logId = 1;

// this function triggers a playlist view
const triggerPlaylistView = (session) => {
  // console.log('triggered playlist view with session', session);
  const list = constants.generateRandomPlaylistInfo();
  const date = constants.parseDate(Number(session[2]));

  // const event = {
  //   playlist_id: list.playlist,
  //   genre_id: list.genre,
  //   date: date.date,
  //   createdAt: date.createdAt,
  //   logId
  // };

  // const log = {
  //   user_id: Number(session[1]),
  //   sessionId: Number(session[0]),
  //   eventTypeId: 1,
  //   date: date.date,
  //   createdAt: date.createdAt,
  //   id: logId
  // };



  const pvSQL = `(${list.playlist}, ${list.genre}, '${date.date}', ${date.createdAt}, ${logId}),\n`;
  const logSQL = `(${Number(session[1])}, '${date.date}', ${date.createdAt}, 1, ${Number(session[0])}),\n`;
  // console.log('view', pvSQL);
  // console.log('log', logSQL);

  logId += 1;
  // const eventJSON = `${JSON.stringify(event)}\n`;
  // const logJSON = `${JSON.stringify(log)}\n`;

  fs.appendFile(logFile, logSQL, (err) => {
    if (err) {
      console.log('error writing logs in playlist view', err);
    } else {
      fs.appendFile(playlistViewFile, pvSQL, (error) => {
        if (err) {
          console.error('error writing to playlist view file', error);
        }
      });
    }
  });
  // return queries.addToLogs(query)
  //   .then((log) => {
  //     query.logId = log.id;
  //     return queries.addToPlaylistView(query);
  //   })
  //   .catch(err => console.log('error adding view from generator', err));   
};

// this function triggers a genre searched
const triggerSearch = (session) => {
  // console.log('triggered search with session', session);
  const value = constants.genres[constants.generateRandomGenreId() - 1];
  const date = constants.parseDate(Number(session[2]));
  // const event = {
  //   value,
  //   date: date.date,
  //   createdAt: date.createdAt,
  //   logId
  // };

  // const log = {
  //   user_id: Number(session[1]),
  //   sessionId: Number(session[0]),
  //   eventTypeId: 2,
  //   date: date.date,
  //   createdAt: date.createdAt,
  //   id: logId
  // };

    // const eventJSON = `${JSON.stringify(event)}\n`;
  // const logJSON = `${JSON.stringify(log)}\n`;
  const eventSQL = `('${value}','${date.date}', ${date.createdAt}, ${logId}),\n`;
  const logSQL = `(${Number(session[1])}, '${date.date}', ${date.createdAt}, 2, ${Number(session[0])}),\n`;
  logId += 1;

  fs.appendFile(logFile, logSQL, (err) => {
    if (err) {
      console.log('error writing logs in search', err);
    } else {
      fs.appendFile(searchFile, eventSQL, (error) => {
        if (err) {
          console.error('error writing to search file', error);
        }
      });
    }
  });
  // return queries.addToLogs(query)
  //   .then((log) => {
  //     query.logId = log.id;
  //     return queries.addToSearch(query);
  //   })
  //   .catch(err => console.log('error adding search from generator', err));
};

// this function triggers a song reaction (liked/disliked)
const triggerSongReaction = (session) => {
  // console.log('triggered song reaction with session', session);
  const list = constants.generateRandomPlaylistInfo();
  const date = constants.parseDate(Number(session[2]));
  // const event = {
  //   liked: constants.generateBoolean(),
  //   song_id: constants.generateRandomSongId(),
  //   playlist_id: list.playlist,
  //   genre_id: list.playlist,
  //   date: date.date,
  //   createdAt: date.createdAt,
  //   logId
  // };

  // const log = {
  //   user_id: Number(session[1]),
  //   sessionId: Number(session[0]),
  //   eventTypeId: 3,
  //   date: date.date,
  //   createdAt: date.createdAt,
  //   id: logId
  // };

  // logId += 1;

    // const eventJSON = `${JSON.stringify(event)}\n`;
  // const logJSON = `${JSON.stringify(log)}\n`;
  const eventSQL = `(${constants.generateRandomSongId()}, ${constants.generateBoolean()}, ${list.playlist}, ${list.genre}, '${date.date}', ${date.createdAt}, ${logId}),\n`;
  const logSQL = `(${Number(session[1])},'${date.date}', ${date.createdAt}, 3, ${Number(session[0])}),\n`;

  logId += 1;

  fs.appendFile(logFile, logSQL, (err) => {
    if (err) {
      console.log('error writing logs in song reaction', err);
    } else {
      fs.appendFile(songReactionFile, eventSQL, (error) => {
        if (err) {
          console.error('error writing to song reactions file', error);
        }
      });
    }
  });


//   return queries.addToLogs(songReaction)
//     .then((log) => {
//       songReaction.logId = log.id;
//       return queries.addToSongReactions(songReaction);
//     })
//     .catch(err => console.log('error adding song reaction from generator', err));
// };
};


// this function triggers a song response (heard/skippeds)
const triggerSongResponse = (session) => {
  // console.log('triggered song response with session', session);
  const list = constants.generateRandomPlaylistInfo();
  const date = constants.parseDate(Number(session[2]));
  // const event = {
  //   listenedTo: constants.generateBoolean(),
  //   song_id: constants.generateRandomSongId(),
  //   playlist_id: list.playlist,
  //   genre_id: list.playlist,
  //   date: date.date,
  //   createdAt: date.createdAt,
  //   logId
  // };

  // const log = {
  //   user_id: Number(session[1]),
  //   sessionId: Number(session[0]),
  //   eventTypeId: 4,
  //   date: date.date,
  //   createdAt: date.createdAt,
  //   id: logId
  // };
  // const eventJSON = `${JSON.stringify(event)}\n`;
  // const logJSON = `${JSON.stringify(log)}\n`;
  const eventSQL = `(${constants.generateRandomSongId()}, ${constants.generateBoolean()}, ${list.playlist}, ${list.genre}, '${date.date}', ${date.createdAt}, ${logId}),\n`;
  const logSQL = `(${Number(session[1])}, '${date.date}', ${date.createdAt}, 4, ${Number(session[0])}),\n`;

  logId += 1;
  // console.log('song response body', songResponse);
  fs.appendFile(logFile, logSQL, (err) => {
    if (err) {
      console.log('error writing logs in song resposne', err);
    } else {
      fs.appendFile(songResponseFile, eventSQL, (error) => {
        if (err) {
          console.error('error writing to song response file', error);
        }
      });
    }
  })

  // return queries.addToLogs(songResponse)
  //   .then((log) => {
  //     songResponse.logId = log.id;
  //     return queries.addToSongResponses(songResponse);
  //   })
  //   .catch(err => console.log('error adding song response from generator', err));
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
const archiveSessions = (active) => {
  fs.truncate(sessionsFile, (err) => {
    if (err) {
      console.log('error truncating file', err);
    } else {
      fs.writeFile(sessionsFile, active, (error) => {
        if (err) {
          console.log('error writing files', error);
        } else {
          triggerEventsOnSessions(active);
        }
      });
    }
  });
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

const getLastTimeStampAndSessionId = (session) => {
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
  const sessionsToGenerate = constants.averageSessionsPerDay(timeStamp) || 1;
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
  lastTimeStampPerRound = start + constants.generateRandomSeconds(5000, 150000);
  lastSession = sessions[sessions.length - 1];
  return sessions;
};

// this function finds all the active sessions, and then passes them to triggerEvents.
const findActiveSessions = (sessions) => {
  const inactive = [];
  let active = sessions ? sessions.split(',') : [];
  active = active.filter((session) => {
    if (Number(session.match(/\d+/g)[3]) < lastTimeStampPerRound) {
      inactive.push(session);
    } else {
      return true;
    }
  });

  inactive.forEach((session) => {
    const details = constants.parseSession(session);
    delete constants.usersWithSessions[details[1]];
  });

  lastEntry = getLastTimeStampAndSessionId(active[active.length - 1]);
  const newSessions = generateRandomSessions(lastEntry);
  active = active.concat(newSessions);
  archiveSessions(active);
};

const getSessions = () => {
  fs.readFile(sessionsFile, (err, data) => {
    if (err) {
      console.log('error reading sessions file', err);
    } else {
      findActiveSessions(data ? data.toString() : null);
    }
  });
};

let catchUpTillDate;

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
  const interval = 100;
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
