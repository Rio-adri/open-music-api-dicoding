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
    albumId: `album-${albumid}`
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
          id: `song-${row.song_id}`,
          title: row.title,
          performer: row.performer,
        });
      }
    });
  
    return album;
};
  

module.exports = { mapDBToModelSong, mapDBToModelAlbum }