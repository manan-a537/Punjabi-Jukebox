import { usePlaylistContext } from "@/context/PlaylistContext";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function MyPlaylists() {
  const { playlists, removePlaylist } = usePlaylistContext();

  return (
    <div className="container max-w-screen-md mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">My Playlists</h1>
      {playlists.length === 0 ? (
        <div className="text-muted-foreground text-center py-8">
          You have no playlists yet.
        </div>
      ) : (
        <div className="space-y-4">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="flex items-center justify-between bg-card rounded-lg p-4 border border-border">
              <div>
                <div className="font-semibold text-lg">{playlist.name}</div>
                <div className="text-xs text-muted-foreground">{playlist.songCount} songs</div>
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => removePlaylist(playlist.id)}
                title="Remove Playlist"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
