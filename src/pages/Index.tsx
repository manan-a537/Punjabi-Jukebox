import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import SongCard from "@/components/SongCard";
import AlbumCard from "@/components/AlbumCard";
import PlaylistCard from "@/components/PlaylistCard";
import SongRow from "@/components/SongRow";
import Hero from "@/components/Hero";
import SectionHeader from "@/components/SectionHeader";
import { 
  featuredArtists, 
  topAlbums, 
  trendingPlaylists, 
  recommendedRadio,
  recentlyPlayed
} from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Song, Album, Playlist } from "@/types";

interface IndexProps {
  currentSong: Song | null;
  isPlaying: boolean;
    onPlaySong: (song: Song, queueOverride?: Song[]) => void;
  onPlayQueue: (songs: Song[], startIndex?: number) => void;
}

const SIDEBAR_WIDTH = 240;
const SIDEBAR_COLLAPSED_WIDTH = 72;

const Index = ({ currentSong, isPlaying, onPlaySong, onPlayQueue }: IndexProps) => {
  const [recentlyPlayedItems, setRecentlyPlayedItems] = useState<(Song | Album | Playlist)[]>(() => {
    const saved = localStorage.getItem("recently-played");
    return saved ? JSON.parse(saved) : [];
  });
  const [allBackendSongs, setAllBackendSongs] = useState<Song[]>([]);
  const [popularBackendSongs, setPopularBackendSongs] = useState<Song[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    localStorage.setItem("recently-played", JSON.stringify(recentlyPlayedItems));
  }, [recentlyPlayedItems]);

  // Helper to add to recently played
  const addToRecentlyPlayed = useCallback((item: Song | Album | Playlist) => {
    setRecentlyPlayedItems(prev => {
      const filtered = prev.filter(i => i.id !== item.id);
      return [item, ...filtered].slice(0, 12); // keep max 12
    });
  }, []);

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
        setPopularBackendSongs(allSongs.slice(0, 8));
      });
  }, []);

  // Helper functions for Album/Playlist play
  const handlePlayAlbum = (album: Album) => {
    addToRecentlyPlayed(album);
    if (album.songs && album.songs.length > 0) {
      const albumSongs = album.songs
        .map(filename => allBackendSongs.find(song => song.filename === filename))
        .filter(Boolean) as Song[];
      if (albumSongs.length > 0) {
        onPlayQueue(albumSongs, 0);
      }
    }
  };
  const handlePlayPlaylist = (playlist: Playlist) => {
    addToRecentlyPlayed(playlist);
    if (playlist.songs.length > 0) {
      const playlistSongs = playlist.songs
        .map(filename => allBackendSongs.find(song => song.filename === filename || song.id === filename))
        .filter(Boolean) as Song[];
      if (playlistSongs.length > 0) {
        onPlayQueue(playlistSongs, 0);
      }
    }
  };
  const handlePlaySongWithRecent = (song: Song) => {
    addToRecentlyPlayed(song);
    onPlaySong(song);
  };

  return (
    <div className="bg-background min-h-screen text-foreground dark">
      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        {/* Main Content */}
        <div
          className="flex-1 pt-5 pb-28 transition-all duration-300"
          style={{ marginLeft: sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH }}
        >
          <div className="px-6 max-w-[1600px] mx-auto">
            {/* Hero Section */}
            <Hero 
              title="Experience the vibrant sounds of Punjabi music"
              subtitle="FEATURED PLAYLIST"
              description="Immerse yourself in the rich culture and energetic rhythms of Punjabi music with our curated playlists."
              image="https://images.pexels.com/photos/2191013/pexels-photo-2191013.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              onPlay={() => {
                if (trendingPlaylists.length > 0) {
                  handlePlayPlaylist(trendingPlaylists[0]);
                }
              }}
              className="mb-10 h-[400px]"
            />
            {/* Recently Played */}
            <section className="mb-10">
              <SectionHeader 
                title="Recently Played Albums"
                action={
                  <Button variant="link" size="sm" className="text-muted-foreground hover:text-foreground">
                    See all <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                }
              />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {recentlyPlayedItems.slice(0, 6).map((item, index) => {
                  if ('title' in item && 'albumCover' in item) {
                    // It's a song
                    return (
                      <SongCard 
                        key={`song-${item.id}-${index}`}
                        song={item as Song}
                        isCurrentSong={currentSong?.id === item.id}
                        isPlaying={isPlaying && currentSong?.id === item.id}
                        onPlay={handlePlaySongWithRecent}
                      />
                    );
                  } else if ('title' in item && 'coverUrl' in item) {
                    // It's an album
                    return (
                      <AlbumCard 
                        key={`album-${item.id}-${index}`}
                        album={item as Album}
                        onPlay={handlePlayAlbum}
                      />
                    );
                  } else {
                    // It's a playlist
                    return (
                      <PlaylistCard 
                        key={`playlist-${item.id}-${index}`}
                        playlist={item as Playlist}
                        onPlay={handlePlayPlaylist}
                      />
                    );
                  }
                })}
              </div>
            </section>
            {/* Popular Songs */}
            <section className="mb-10">
              <SectionHeader 
                title="Popular Songs"
                description="Listen to the most trending Punjabi tracks"
                action={
                  <Button variant="link" size="sm" className="text-muted-foreground hover:text-foreground">
                    See all <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                }
              />
              <div className="bg-card/50 rounded-xl p-4 border border-border/50">
                <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs uppercase text-muted-foreground font-medium">
                  <div className="col-span-1 flex justify-center">#</div>
                  <div className="col-span-4">Title</div>
                  <div className="col-span-3">Album</div>
                  <div className="col-span-2">Date Added</div>
                  <div className="col-span-1"></div>
                  <div className="col-span-1 flex justify-end">Duration</div>
                </div>
                <div className="mt-2">
                  {popularBackendSongs.map((song, index) => (
                    <SongRow
                      key={song.id}
                      song={song}
                      index={index}
                      isCurrentSong={currentSong?.id === song.id}
                      isPlaying={isPlaying && currentSong?.id === song.id}
                      onPlay={onPlaySong}
                    />
                  ))}
                </div>
              </div>
            </section>
            {/* Top Albums */}
            <section className="mb-10">
              <SectionHeader 
                title="Top Albums"
                action={
                  <Button variant="link" size="sm" className="text-muted-foreground hover:text-foreground">
                    See all <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                }
              />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {topAlbums.map((album) => (
                  <AlbumCard 
                    key={album.id}
                    album={album}
                    onPlay={handlePlayAlbum}
                  />
                ))}
              </div>
            </section>
            {/* Featured Playlists */}
            <section className="mb-10">
              <SectionHeader 
                title="Featured Playlists"
                description="Curated playlists to match your mood"
                action={
                  <Button variant="link" size="sm" className="text-muted-foreground hover:text-foreground">
                    See all <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                }
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {trendingPlaylists.map((playlist) => (
                  <PlaylistCard 
                    key={playlist.id}
                    playlist={playlist}
                    onPlay={handlePlayPlaylist}
                  />
                ))}
              </div>
            </section>
            {/* Recommended Radio */}
            <section className="mb-10">
              <SectionHeader 
                title="Recommended Radio"
                description="Stations based on your taste"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendedRadio.map((radio) => (
                  <div 
                    key={radio.id}
                    className="group relative h-40 rounded-xl overflow-hidden cursor-pointer hover-scale border border-transparent hover:border-border"
                  >
                    <div className="absolute inset-0 z-0">
                      <img 
                        src={radio.coverUrl} 
                        alt={radio.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                      <h3 className="text-white font-medium">{radio.name}</h3>
                      <p className="text-white/80 text-sm mt-1">{radio.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
