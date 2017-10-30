const path = require('path');

// text files
const logs = path.join(__dirname, './sql-files/logs.sql');
const songResponses = path.join(__dirname, './sql-files/song-responses.sql');
const songReactions = path.join(__dirname, './sql-files/song-reactions.sql');
const searches = path.join(__dirname, './sql-files/searches.sql');
const playlistViews = path.join(__dirname, './sql-files/playlist-views.sql');
const sessions = path.join(__dirname, './text/sessions.txt');

// json files
const logsJSON = path.join(__dirname, './jsons/logs.json');
const songResponsesJSON = path.join(__dirname, './jsons/song-responses.json');
const songReactionsJSON = path.join(__dirname, './jsons/song-reactions.json');
const searchesJSON = path.join(__dirname, './jsons/searches.json');
const playlistViewsJSON = path.join(__dirname, './jsons/playlist-views.json');
const sessionsJSON = path.join(__dirname, './jsons/sessiions.json');

const index = JSON.stringify({ index: {} });

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
  sessionsJSON,
  index
  // logIndex,
  // pvIndex,
  // searchIndex,
  // songResponseIndex,
  // songReactionIndex
};
