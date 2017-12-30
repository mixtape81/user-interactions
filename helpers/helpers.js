// organizes songs by playlist
const organizeSongsByPlaylist = (songs) => {
  const sorted = [];
  for (let i = 1; i < 21; i += 1) {
    sorted.push({ playlist_id: i, songs: [] });
  }
  songs.forEach(song => sorted[song.playlist_id - 1].songs.push(song));
  return sorted;
};


const insertQueries = {
  logs: 'INSERT INTO logs (user_id, date, "createdAt", "eventTypeId", "sessionId") VALUES',
  views: 'INSERT INTO playlist_views (playlist_id, genre_id, date, "createdAt", "logId") VALUES',
  searches: 'INSERT INTO searches (value, date, "createdAt", "logId") VALUES',
  reactions: 'INSERT INTO song_reactions (song_id, liked, playlist_id, genre_id, date, "createdAt", "logId") VALUES',
  responses: 'INSERT INTO song_responses (song_id, "listenedTo", playlist_id, genre_id, "date", "createdAt", "logId") VALUES'
};

const retrieveQueries = {
  logId: 'SELECT id from logs WHERE'
}

const parseValues = (type, values) => {
  const {
    userId, date, sessionId, createdAt, eventId, playlistId,
    genreId, logId, value, songId, liked, listenedTo
  } = values;

  if (type === 'view') {
    return `(${playlistId}, ${genreId}, '${date}', ${createdAt}, ${logId})`;
  } else if (type === 'search') {
    return `('${value}','${date}', ${createdAt}, ${logId})`;
  } else if (type === 'response') {
    return `(${songId}, ${listenedTo}, ${playlistId}, ${genreId}, '${date}', ${createdAt}, ${logId})`;
  } else if (type === 'reaction') {
    return `(${songId}, ${liked}, ${playlistId}, ${genreId}, '${date}', ${createdAt}, ${logId})`;
  }
  // else log values
  return `(${userId}, '${date}', ${createdAt}, ${eventId}, ${sessionId})`;
};

const getId = (response) => {
  return response[0][0].id;
}

module.exports = {
  organizeSongsByPlaylist,
  insertQueries,
  retrieveQueries,
  parseValues,
  getId
};

