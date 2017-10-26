const organizeSongsByPlaylist = (songs) => {
  const sorted = [];
  for (let i = 1; i < 21; i += 1) {
    sorted.push({ playlist_id: i, songs: [] });
  }
  songs.forEach(song => sorted[song.playlist_id - 1].songs.push(song));
  return sorted;
};

module.exports = {
  organizeSongsByPlaylist
};
