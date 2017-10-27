const fs = require('fs');
const path = require('path');
const constants = require('./data-gen-constants.js');
const queries = require('./queries.js');

let addTime;

// this function triggers a playlist view
const triggerPlaylistView = (session) => {
  console.log('triggered playlist view with session', session);
  const list = constants.generateRandomPlaylistInfo();
  const query = {
    user_id: session[1],
    sessionId: session[0],
    eventTypeId: 1,
    playlist_id: list.playlist,
    genre_id: list.genre,
    date: new Date()
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
  console.log('triggered search with session', session);
  const value = constants.genres[constants.generateRandomGenreId() - 1];
  const query = {
    value,
    user_id: session[1],
    sessionId: session[0],
    eventTypeId: 2,
    date: new Date()
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
  console.log('triggered song reaction with session', session);
  const list = constants.generateRandomPlaylistInfo();
  const songReaction = {
    liked: constants.generateBoolean(),
    song_id: constants.generateRandomSongId(),
    playlist_id: list.playlist,
    user_id: session[1],
    sessionId: session[0],
    eventTypeId: 3,
    genre_id: list.playlist,
    date: new Date()
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
  console.log('triggered song response with session', session);
  const list = constants.generateRandomPlaylistInfo();
  const songResponse = {
    liked: constants.generateBoolean(),
    song_id: constants.generateRandomSongId(),
    playlist_id: list.playlist,
    user_id: session[1],
    sessionId: session[0],
    eventTypeId: 4,
    genre_id: list.playlist,
    date: new Date()
  };

  return queries.addToLogs(songResponse)
    .then((log) => {
      songResponse.logId = log.id;
      return queries.addToSongResponses(songResponse);
    })
    .catch(err => console.log('error adding song response from generator', err));
};

const triggerSkip = (session) => {
  console.log('triggered skip for this session', session);
};

// this function will initiate a trigger for a specific event for each session
const triggerEventsOnSessions = (sessionsToTrigger) => {
  const events = [triggerPlaylistView, triggerSearch,
    triggerSongReaction, triggerSongResponse, triggerSkip];
  sessionsToTrigger.forEach((session) => {
    const event = events[constants.generateRandomEvent()];
    event(constants.parseSession(session));
  });
};

// this function writes current sessions to sessions.txt
const archiveSessions = (active) => {
  const file = path.join(__dirname, './sessions.txt');
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
const generateRandomEndTime = () => {
  const sessionTime = Math.floor(Math.random() * 60) * 600000;
  const time = Date.now() + addTime;
  return time + sessionTime;
};

// this session adds a random milliseconds to session starts to keep them more unique
const addRandomTime = () => {
  addTime = Math.floor(Math.random() * 10000);
  return addTime;
};

// this function creates 500 random users each time it runs
const generateRandomSessions = (sessionId) => {
  const sessions = [];
  for (let i = 0; i < 1; i += 1) {
    const user = constants.generateRandomUserId();
    if (!constants.usersWithSessions[user]) {
      sessions.push(`${sessionId}--${user}--${Date.now() + addRandomTime()}--${generateRandomEndTime()}`);
      constants.usersWithSessions[user] = true;
    }
    sessionId += 1;
  }
  return sessions;
};

// this function finds all the active sessions, and then passes them to triggerEvents.
const findActiveSessions = (sessions) => {
  let active = sessions ? sessions.split(',') : [];
  active = active.filter(session => !(session.match(/\d+/g)[3] < Date.now()));
  const lastSessionId = active.length ? active[active.length - 1].match(/\d+/)[0] : 0;
  const newSessions = generateRandomSessions(Number(lastSessionId) + 1);
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

getSessions();


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
  triggerSongResponse
};
