const fs = require('fs');
const songs = JSON.parse(fs.readFileSync('songs.json', 'utf-8'));
songs.forEach(song => {
  if (song.audioUrl && song.audioUrl.startsWith('./')) {
    song.audioUrl = '/songs/' + song.audioUrl.replace('./', '');
  }
});
fs.writeFileSync('songs.json', JSON.stringify(songs, null, 2));
console.log('audioUrl fields updated!');
