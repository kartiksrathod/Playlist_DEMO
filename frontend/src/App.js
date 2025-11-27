import React, { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { Toaster } from "sonner";
import Playlists from "@/pages/Playlists";
import PlaylistDetail from "@/pages/PlaylistDetail";
import Library from "@/pages/Library";
import TrackDetail from "@/pages/TrackDetail";
import Settings from "@/pages/Settings";
import Profile from "@/pages/Profile";
import History from "@/pages/History";
import Favorites from "@/pages/Favorites";
import SharedPlaylist from "@/pages/SharedPlaylist";
import PublicPlaylists from "@/pages/PublicPlaylists";
import AppLayout from "@/components/AppLayout";
import PreviewGlass from "@/pages/PreviewGlass";
import PreviewVibrant from "@/pages/PreviewVibrant";
import PreviewNeon from "@/pages/PreviewNeon";
import PreviewRetro from "@/pages/PreviewRetro";
import PreviewMesh from "@/pages/PreviewMesh";
import PreviewPremium from "@/pages/PreviewPremium";
import { PlayerProvider } from "@/context/PlayerContext";
import { ThemeProvider } from "@/context/ThemeContext";
import MusicPlayer from "@/components/MusicPlayer";
import KeyboardShortcutsHelp from "@/components/KeyboardShortcutsHelp";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { ArrowRight, Music, ListMusic, Sparkles, Play, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [loading, setLoading] = useState(true);

  const helloWorldApi = async () => {
    try {
      const response = await axios.get(`${API}/`);
      console.log(response.data.message);
    } catch (e) {
      console.error(e, `errored out requesting / api`);
    }
  };

  // Fetch recently played tracks
  const fetchRecentlyPlayed = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/history?limit=6`);
      setRecentlyPlayed(response.data.history || []);
    } catch (error) {
      console.error('Error fetching recently played:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    helloWorldApi();
    fetchRecentlyPlayed();
  }, []);

  return (
    <AppLayout>
      <div className="min-h-screen bg-slate-950">
        {/* Hero Section with Video Background */}
        <div className="relative h-[70vh] overflow-hidden">
          {/* Video Background - Emotional Music Theme */}
          <div className="absolute inset-0">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="https://cdn.pixabay.com/video/2024/06/04/215172_large.mp4" type="video/mp4" />
            </video>
            {/* Softer, darker overlay for eye comfort */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-slate-950/85 to-indigo-950/90" />
          </div>

          {/* Hero Content */}
          <div className="relative h-full flex flex-col items-center justify-center px-4 text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/25 backdrop-blur-xl rounded-full text-sm mb-6 border border-blue-400/40 shadow-lg shadow-blue-900/30">
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span className="text-blue-50">Your music, beautifully organized</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-light text-center mb-6 tracking-tight text-white drop-shadow-2xl">
              Music Playlist<br />Manager
            </h1>
            
            <p className="text-xl text-blue-50 text-center mb-10 max-w-2xl font-light drop-shadow-lg">
              Create, organize, and manage your music playlists with an immersive interface
            </p>

            <a href="/playlists">
              <button className="group px-8 py-4 bg-blue-700 hover:bg-blue-600 text-white rounded-xl font-medium transition-all shadow-2xl hover:shadow-blue-600/60 backdrop-blur-sm border border-blue-500/30 flex items-center gap-2">
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </a>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20 px-4 bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-light text-center mb-4 text-white">Simple. Beautiful. Functional.</h2>
            <p className="text-center text-blue-100 mb-16 font-light">Everything you need to manage your music collection</p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:shadow-blue-600/30 transition-all border border-blue-800/30">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mb-6 shadow-lg shadow-blue-700/50">
                  <ListMusic className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-medium mb-3 text-white">Create Playlists</h3>
                <p className="text-blue-100 font-light leading-relaxed">
                  Organize your music into beautiful playlists with custom cover images
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:shadow-cyan-600/30 transition-all border border-cyan-800/30">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center mb-6 shadow-lg shadow-cyan-700/50">
                  <Music className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-medium mb-3 text-white">Add Tracks</h3>
                <p className="text-blue-100 font-light leading-relaxed">
                  Add tracks via URL or upload audio files directly to your playlists
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:shadow-indigo-600/30 transition-all border border-indigo-800/30">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center mb-6 shadow-lg shadow-indigo-700/50">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-medium mb-3 text-white">Immersive Interface</h3>
                <p className="text-blue-100 font-light leading-relaxed">
                  Enjoy a beautiful, cinematic experience with a modern dark design
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recently Played Section */}
        <div className="py-20 px-4 bg-slate-950">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-light text-white mb-2">Recently Played</h2>
                <p className="text-blue-100 font-light">Pick up where you left off</p>
              </div>
              <a href="/history">
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-900/60 hover:bg-slate-800/60 text-blue-100 rounded-xl font-medium transition-all border border-blue-800/30">
                  <span>View All</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </a>
            </div>

            {/* Recently Played Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-blue-100">Loading recently played...</p>
              </div>
            ) : recentlyPlayed.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-slate-900/60 backdrop-blur-xl flex items-center justify-center mx-auto mb-4 border border-blue-800/30">
                  <Music className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-blue-100 mb-2">No recently played tracks</p>
                <p className="text-blue-200 text-sm">Start listening to see your history here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentlyPlayed.map((item, index) => (
                  <div
                    key={item.id}
                    className="group bg-slate-900/60 backdrop-blur-xl rounded-xl p-4 border border-blue-800/30 hover:border-blue-600/50 transition-all hover:shadow-xl hover:shadow-blue-700/30"
                  >
                    <div className="flex items-center gap-4">
                      {/* Album Art or Playlist Cover */}
                      {item.playlist?.coverImage ? (
                        <img
                          src={`${BACKEND_URL}${item.playlist.coverImage}`}
                          alt={item.track?.songName}
                          className="w-14 h-14 rounded-lg object-cover shadow-lg flex-shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-700/40 flex-shrink-0">
                          <Music className="w-7 h-7 text-white" />
                        </div>
                      )}

                      {/* Track Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium text-sm mb-1 truncate group-hover:text-blue-300 transition-colors">
                          {item.track?.songName || 'Unknown Track'}
                        </h3>
                        <p className="text-blue-200 text-xs truncate">{item.track?.artist || 'Unknown Artist'}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Play className="w-3 h-3 text-blue-400" />
                          <span className="text-xs text-blue-300">
                            {new Date(item.playedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

// Component to enable keyboard shortcuts
const KeyboardShortcutsWrapper = ({ children }) => {
  useKeyboardShortcuts();
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <PlayerProvider>
        <KeyboardShortcutsWrapper>
          <div className="App">
            <Toaster position="top-center" richColors />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/playlists" element={<Playlists />} />
                <Route path="/playlists/:playlistId" element={<PlaylistDetail />} />
                <Route path="/library" element={<Library />} />
                <Route path="/library/track/:trackId" element={<TrackDetail />} />
                <Route path="/history" element={<History />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/public" element={<PublicPlaylists />} />
                <Route path="/public-playlists" element={<PublicPlaylists />} />
                <Route path="/shared/:token" element={<SharedPlaylist />} />
                <Route path="/preview/glass" element={<PreviewGlass />} />
                <Route path="/preview/vibrant" element={<PreviewVibrant />} />
                <Route path="/preview/neon" element={<PreviewNeon />} />
                <Route path="/preview/retro" element={<PreviewRetro />} />
                <Route path="/preview/mesh" element={<PreviewMesh />} />
                <Route path="/preview/premium" element={<PreviewPremium />} />
              </Routes>
              {/* Global Music Player */}
              <MusicPlayer />
              {/* Keyboard Shortcuts Help */}
              <KeyboardShortcutsHelp />
            </BrowserRouter>
          </div>
        </KeyboardShortcutsWrapper>
      </PlayerProvider>
    </ThemeProvider>
  );
}

export default App;
