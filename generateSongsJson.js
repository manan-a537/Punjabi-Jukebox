import fs from 'fs';
import path from 'path';

// Set the directory to the main folder (where this script is located)
const songsDir = path.resolve('./');

const files = fs.readdirSync(songsDir)
  .filter(f => f.endsWith('.mp3'));

const songs = files.map(filename => {
  const base = filename.replace(/\.mp3$/i, '');
  let title = base;
  let artist = '';
  if (base.includes(' - ')) {
    const parts = base.split(' - ');
    title = parts[0].trim();
    artist = parts.slice(1).join(' - ').trim();
  }
  return {
    title,
    artist,
    filename
  };
});

fs.writeFileSync('songs.json', JSON.stringify(songs, null, 2));
console.log(`songs.json created with ${songs.length} songs!`);