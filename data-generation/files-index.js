const path = require('path');

// sql files
const logs = path.join(__dirname, './sql-files/logs.sql');
const songResponses = path.join(__dirname, './sql-files/song-responses.sql');
const songReactions = path.join(__dirname, './sql-files/song-reactions.sql');
const searches = path.join(__dirname, './sql-files/searches.sql');
const playlistViews = path.join(__dirname, './sql-files/playlist-views.sql');

// json files
const logsJSON = path.join(__dirname, './jsons/logs.json');
const songResponsesJSON = path.join(__dirname, './jsons/song-responses.json');
const songReactionsJSON = path.join(__dirname, './jsons/song-reactions.json');
const searchesJSON = path.join(__dirname, './jsons/searches.json');
const playlistViewsJSON = path.join(__dirname, './jsons/playlist-views.json');

// index object for elasticsearch
const index = JSON.stringify({ index: {} });

// text file that contains all the constants for data generator
const users = path.join(__dirname, './text/users.txt');
const currentUsers = path.join(__dirname, './real-time-text-files/users.txt');

// text file to store sessions temporarily
const sessions = path.join(__dirname, './text/sessions.txt');
const currentSessions = path.join(__dirname, './real-time-text-files/sessions.txt');

module.exports = {
  logs,
  logsJSON,
  songResponses,
  songResponsesJSON,
  songReactions,
  songReactionsJSON,
  searches,
  searchesJSON,
  playlistViews,
  playlistViewsJSON,
  sessions,
  index,
  users,
  currentUsers,
  currentSessions
};
