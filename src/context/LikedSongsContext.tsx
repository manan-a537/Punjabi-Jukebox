import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Song } from "@/types";

interface LikedSongsContextType {
  likedSongs: Song[];
  toggleLike: (song: Song) => void;
  isLiked: (songId: string) => boolean;
}

const LikedSongsContext = createContext<LikedSongsContextType | undefined>(undefined);

export const LikedSongsProvider = ({ children }: { children: ReactNode }) => {
  const [likedSongs, setLikedSongs] = useState<Song[]>(() => {
    const saved = localStorage.getItem("liked-songs");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("liked-songs", JSON.stringify(likedSongs));
  }, [likedSongs]);

  const toggleLike = (song: Song) => {
    setLikedSongs(prev => {
      const isLiked = prev.some(s => s.id === song.id);
      if (isLiked) {
        return prev.filter(s => s.id !== song.id);
      } else {
        return [...prev, song];
      }
    });
  };

  const isLiked = (songId: string) => likedSongs.some(song => song.id === songId);

  return (
    <LikedSongsContext.Provider value={{ likedSongs, toggleLike, isLiked }}>
      {children}
    </LikedSongsContext.Provider>
  );
};

export function useLikedSongsContext() {
  const context = useContext(LikedSongsContext);
  if (!context) throw new Error("useLikedSongsContext must be used within a LikedSongsProvider");
  return context;
}
