import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Playlist, Song } from "@/types";

interface PlaylistContextType {
  playlists: Playlist[];
  createPlaylist: (name: string, description?: string) => Playlist;
  addSongToPlaylist: (playlistId: string, song: Song) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  deletePlaylist: (playlistId: string) => void;
  removePlaylist: (playlistId: string) => void; // alias for clarity
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export const PlaylistProvider = ({ children }: { children: ReactNode }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    const saved = localStorage.getItem("user-playlists");
    return saved ? JSON.parse(saved) : [];
  });

  // Sync with localStorage and across tabs
  useEffect(() => {
    localStorage.setItem("user-playlists", JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "user-playlists") {
        setPlaylists(e.newValue ? JSON.parse(e.newValue) : []);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const createPlaylist = (name: string, description: string = "") => {
    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      name,
      description,
      coverUrl: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg",
      songCount: 0,
      createdBy: "User",
      songs: []
    };
    setPlaylists(prev => [...prev, newPlaylist]);
    return newPlaylist;
  };

  const addSongToPlaylist = (playlistId: string, song: Song) => {
    // Always use filename as the key
    if (!song.filename) return;
    setPlaylists(prev => prev.map(playlist => {
      if (playlist.id === playlistId) {
        const songs = playlist.songs.includes(song.filename)
          ? playlist.songs
          : [...playlist.songs, song.filename];
        return {
          ...playlist,
          songs,
          songCount: songs.length
        };
      }
      return playlist;
    }));
  };

  const removeSongFromPlaylist = (playlistId: string, songFilename: string) => {
    setPlaylists(prev => prev.map(playlist => {
      if (playlist.id === playlistId) {
        const songs = playlist.songs.filter(filename => filename !== songFilename);
        return {
          ...playlist,
          songs,
          songCount: songs.length
        };
      }
      return playlist;
    }));
  };

  const deletePlaylist = (playlistId: string) => {
    setPlaylists(prev => prev.filter(playlist => playlist.id !== playlistId));
  };

  return (
    <PlaylistContext.Provider value={{ playlists, createPlaylist, addSongToPlaylist, removeSongFromPlaylist, deletePlaylist, removePlaylist: deletePlaylist }}>
      {children}
    </PlaylistContext.Provider>
  );
};

export function usePlaylistContext() {
  const ctx = useContext(PlaylistContext);
  if (!ctx) throw new Error("usePlaylistContext must be used within a PlaylistProvider");
  return ctx;
}
