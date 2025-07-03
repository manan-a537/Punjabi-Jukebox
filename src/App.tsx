import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import NotFound from "./pages/NotFound";
import Search from "@/pages/Search";
import MusicPlayer from "@/components/MusicPlayer";
import { useState } from "react";
import { Song } from "@/types";
import PlaylistPage from "@/pages/Playlist";
import SignUp from "@/pages/SignUp";
import LikedSongs from "@/pages/LikedSongs";
import { Header } from "@/components/Header";
import Library from "@/pages/Library";
import MyPlaylists from "@/pages/MyPlaylists";
import { LikedSongsProvider } from "@/context/LikedSongsContext";
import { PlaylistProvider } from "@/context/PlaylistContext";

const queryClient = new QueryClient();

const App = () => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Song[]>([]);
  const [queueIndex, setQueueIndex] = useState<number>(-1);

  const handlePlaySong = (song: Song, queueOverride?: Song[]) => {
    let newQueue = queueOverride || queue;
    let newIndex = newQueue.findIndex((s) => s.id === song.id);
    if (queueOverride) {
      setQueue(queueOverride);
      setQueueIndex(newIndex);
    } else if (newIndex !== -1) {
      setQueueIndex(newIndex);
    } else {
      setQueue([song]);
      setQueueIndex(0);
      newQueue = [song];
      newIndex = 0;
    }
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const handlePlayQueue = (songs: Song[], startIndex = 0) => {
    setQueue(songs);
    setQueueIndex(startIndex);
    setCurrentSong(songs[startIndex]);
    setIsPlaying(true);
  };

  const handleNext = () => {
    if (queue.length > 0 && queueIndex < queue.length - 1) {
      const nextIndex = queueIndex + 1;
      setQueueIndex(nextIndex);
      setCurrentSong(queue[nextIndex]);
      setIsPlaying(true);
    }
  };

  const handlePrevious = () => {
    if (queue.length > 0 && queueIndex > 0) {
      const prevIndex = queueIndex - 1;
      setQueueIndex(prevIndex);
      setCurrentSong(queue[prevIndex]);
      setIsPlaying(true);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <LikedSongsProvider>
        <PlaylistProvider>
        <Router>
          <div className="flex h-screen bg-background">
            <div className="flex-1 relative">
              <Header />
              <main className="flex-1 overflow-y-auto pb-28 h-full">
                <Routes>
                  <Route path="/" element={<Index currentSong={currentSong} isPlaying={isPlaying} onPlaySong={handlePlaySong} onPlayQueue={handlePlayQueue} />} />
                  <Route path="/search" element={<Search currentSong={currentSong} isPlaying={isPlaying} onPlaySong={handlePlaySong} />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/liked-songs" element={<LikedSongs currentSong={currentSong} isPlaying={isPlaying} onPlaySong={handlePlaySong} />} />
                  <Route path="/playlist/:id" element={<PlaylistPage currentSong={currentSong} isPlaying={isPlaying} onPlaySong={handlePlaySong} />} />
                  <Route path="/library" element={<Library />} />
                  <Route path="/my-playlists" element={<MyPlaylists />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <MusicPlayer 
                song={currentSong}
                isPlaying={isPlaying}
                onPlayPause={() => setIsPlaying(!isPlaying)}
                onNext={handleNext}
                onPrevious={handlePrevious}
              />
            </div>
          </div>
        </Router>
        </PlaylistProvider>
        </LikedSongsProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
