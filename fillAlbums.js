const fs = require('fs');

// Load songs.json
const songs = JSON.parse(fs.readFileSync('songs.json', 'utf-8'));

// Copy your topAlbums array from mockData.ts here:
const topAlbums = [
  { id: "album1", title: "G.O.A.T.", artist: "Diljit Dosanjh" },
  { id: "album2", title: "Hidden Gems", artist: "AP Dhillon" },
  { id: "album3", title: "Moosetape", artist: "Sidhu Moose Wala" },
  { id: "album4", title: "BTFU", artist: "Karan Aujla" },
  { id: "album5", title: "MAN OF THE MOON", artist: "Guru Randhawa" },
  { id: "album6", title: "Restless", artist: "Harrdy Sandhu" }
];

// Fill each album with songs by its artist
const filledAlbums = topAlbums.map(album => {
  // Find all songs where the artist field includes the album artist name
  const albumSongs = songs
    .filter(song => song.artist && song.artist.toLowerCase().includes(album.artist.toLowerCase()))
    .map(song => song.filename);

  return {
    ...album,
    songs: albumSongs
  };
});

console.log(JSON.stringify(filledAlbums, null, 2));
