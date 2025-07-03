const fs = require('fs');
const path = require('path');

const SONGS_DIR = path.join(__dirname, '../public/songs');

function parseSongFile(filename) {
  // Remove extension
  const name = filename.replace(/\.mp3$/i, '');
  // Split on first ' - '
  const [title, ...artistParts] = name.split(' - ');
  const artist = artistParts.length ? artistParts.join(' - ') : 'Unknown Artist';
  return {
    title: title.trim(),
    artist: artist.trim(),
    album: 'Unknown Album',
    albumCover: '',
    duration: 0,
    dateAdded: '',
    isLiked: false,
    audioUrl: `./${filename}`
  };
}

fs.readdir(SONGS_DIR, (err, files) => {
  if (err) throw err;
  const songs = files
    .filter(f => f.toLowerCase().endsWith('.mp3'))
    .map(parseSongFile);
  console.log(JSON.stringify(songs, null, 2));
});
