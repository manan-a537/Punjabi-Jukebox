import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePlaylistContext } from "@/context/PlaylistContext";
import { Song } from "@/types";
import SongRow from "@/components/SongRow";

interface PlaylistPageProps {
  currentSong?: Song | null;
  isPlaying?: boolean;
  onPlaySong: (song: Song) => void;
}

export default function PlaylistPage({ currentSong, isPlaying, onPlaySong }: PlaylistPageProps) {
  const { id } = useParams<{ id: string }>();
  const { playlists, removeSongFromPlaylist } = usePlaylistContext();
  const [allBackendSongs, setAllBackendSongs] = useState<Song[]>([]);

  useEffect(() => {
    fetch('/api/songs')
      .then(res => res.json())
      .then(data => {
        const allSongs = data.map((song: any) => ({
          id: song._id || song.id,
          title: song.title,
          artist: song.artist,
          album: song.album || '',
          albumCover: song.albumCover || '',
          duration: song.duration || 0,
          dateAdded: song.dateAdded || '',
          isLiked: song.isLiked || false,
          audioUrl: song.audioUrl || '',
          filename: song.filename || '',
        }));
        setAllBackendSongs(allSongs);
      });
  }, []);

  const playlist = playlists.find(p => p.id === id);
  if (!playlist) return <div>Playlist not found</div>;

  const playlistSongs = playlist.songs
    .map(filename => allBackendSongs.find(s => s.filename === filename))
    .filter((song): song is Song => song !== undefined);

  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-6">
      <div className="flex items-end gap-6 mb-8">
        <div className="w-48 h-48 bg-muted rounded-lg overflow-hidden">
          <img
            src={playlist.coverUrl}
            alt={playlist.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{playlist.name}</h1>
          <p className="text-muted-foreground mt-2">{playlist.description}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {playlist.songCount} songs
          </p>
        </div>
      </div>

      <div className="bg-card/50 rounded-xl p-4 border border-border/50">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs uppercase text-muted-foreground font-medium">
          <div className="col-span-1 flex justify-center">#</div>
          <div className="col-span-4">Title</div>
          <div className="col-span-3">Album</div>
          <div className="col-span-2">Date Added</div>
          <div className="col-span-1"></div>
          <div className="col-span-1 flex justify-end">Duration</div>
        </div>

        {/* Songs */}
        <div className="mt-2">
          {playlistSongs.map((song, index) => (
            <SongRow
              key={song.id}
              song={song}
              index={index}
              isCurrentSong={currentSong?.id === song.id}
              isPlaying={isPlaying && currentSong?.id === song.id}
              onPlay={onPlaySong}
              onRemove={() => removeSongFromPlaylist(playlist.id, song.filename!)}
              showRemoveButton
            />
          ))}
        </div>
      </div>
    </div>
  );
}