import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Song type based on backend response
interface Song {
  _id: string;
  title: string;
  artist: string;
  filename: string;
}

interface SongListProps {
  onPlaySong?: (song: Song) => void;
}

export function SongList({ onPlaySong }: SongListProps) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSongs();
  }, []);

  const loadSongs = async () => {
    try {
      const res = await fetch('/api/songs');
      const songsData = await res.json();
      setSongs(songsData);
    } catch (error) {
      setError('Failed to load songs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading songs...</div>;
  }

  return (
    <div className="space-y-4 p-4">
      {error && (
        <div className="text-red-500 p-2 rounded bg-red-50 mb-4">
          {error}
        </div>
      )}
      {songs.length === 0 ? (
        <div className="text-center p-4">No songs available. Please upload some songs first.</div>
      ) : (
        songs.map((song) => (
          <Card key={song._id} className="overflow-hidden">
            <CardContent className="p-4 flex items-center gap-4">
              {/* No album cover from backend, so skip image */}
              <div className="flex-grow">
                <h3 className="font-semibold">{song.title}</h3>
                <p className="text-sm text-gray-500">{song.artist}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Audio URL: /songs/{song.filename}
                </p>
              </div>
              <Button
                onClick={() => onPlaySong && onPlaySong(song)}
              >
                Play
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}