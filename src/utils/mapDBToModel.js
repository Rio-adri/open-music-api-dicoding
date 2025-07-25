const mapDBToModelSong = ({
    id,
    title, 
    year,
    performer,
    genre,
    duration,
    albumid
}) => ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    albumId: albumid
});

const mapDBToModelAlbum = (rows) => {
    const firstRow = rows[0];
  
    const album = {
      id: firstRow.id,
      name: firstRow.name,
      year: firstRow.year,
      songs: [],
    };
  
    rows.forEach((row) => {
      if (row.song_id) {
        album.songs.push({
          id: row.song_id,
          title: row.title,
          performer: row.performer,
        });
      }
    });
  
    return album;
};

const forPlaylist = ({
  id,
  name,
  username,
}) => ({
  id,
  name,
  username,
});

const forPlaylistSongs = (rows) => {
  const { id, name, username } = rows[0];

  const songs = rows.map(row => ({
    id: row.song_id,
    title: row.title,
    performer: row.performer,
  }));

  return {
    id,
    name,
    username,
    songs,
  };
};

  

module.exports = { mapDBToModelSong, mapDBToModelAlbum, forPlaylist, forPlaylistSongs }