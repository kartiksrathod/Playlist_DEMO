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
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { useTheme } from '@/context/ThemeContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [loading, setLoading] = useState(true);
  const { scrollY } = useScroll();
  const { themeConfig } = useTheme();
  
  // Parallax effect for hero content
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

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

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <AppLayout>
      <div className={`min-h-screen ${themeConfig.classes.body} overflow-hidden`}>
        {/* Theme Switcher - Fixed Position */}
        <div className="fixed top-6 right-6 z-50">
          <ThemeSwitcher />
        </div>

        {/* Hero Section with Video Background */}
        <div className="relative h-[70vh] overflow-hidden">
          {/* Video Background - Emotional Music Theme */}
          <motion.div 
            className="absolute inset-0"
            style={{ scale: useTransform(scrollY, [0, 500], [1, 1.1]) }}
          >
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="https://cdn.pixabay.com/video/2024/06/04/215172_large.mp4" type="video/mp4" />
            </video>
            {/* Enhanced gradient overlay with glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-950/90 via-slate-950/85 to-fuchsia-950/90" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            
            {/* Animated gradient orbs */}
            <motion.div 
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.5, 0.3, 0.5],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          {/* Hero Content with Parallax */}
          <motion.div 
            className="relative h-full flex flex-col items-center justify-center px-4 text-white"
            style={{ y: heroY, opacity: heroOpacity }}
          >
            {/* Badge with pulse animation */}
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 backdrop-blur-xl rounded-full text-sm mb-6 border border-violet-400/40 shadow-lg shadow-violet-900/50"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-violet-200" />
              </motion.div>
              <span className="text-violet-50 font-medium">Your music, beautifully organized</span>
            </motion.div>
            
            {/* Main heading with gradient text */}
            <motion.h1 
              className="text-6xl md:text-8xl font-bold text-center mb-6 tracking-tight bg-gradient-to-r from-white via-violet-200 to-fuchsia-200 bg-clip-text text-transparent drop-shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Music Playlist<br />Manager
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p 
              className="text-xl text-violet-100 text-center mb-10 max-w-2xl font-light drop-shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Create, organize, and manage your music playlists with an immersive interface
            </motion.p>

            {/* CTA Button with glow effect */}
            <motion.a 
              href="/playlists"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <motion.button 
                className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-2xl font-semibold transition-all shadow-2xl hover:shadow-violet-500/50 flex items-center gap-2 overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Animated shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{
                    x: ['-200%', '200%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 1
                  }}
                />
                <span className="relative z-10">Get Started</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
              </motion.button>
            </motion.a>

            {/* Floating music notes */}
            <motion.div
              className="absolute bottom-20 left-10 text-violet-300/40"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Music className="w-12 h-12" />
            </motion.div>
            <motion.div
              className="absolute top-32 right-16 text-fuchsia-300/40"
              animate={{
                y: [0, -30, 0],
                rotate: [0, -10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            >
              <Music className="w-10 h-10" />
            </motion.div>
          </motion.div>
        </div>

        {/* Features Section with Scroll Animations */}
        <div className="py-20 px-4 bg-gradient-to-b from-slate-950 via-violet-950/30 to-slate-950 relative">
          {/* Ambient glow effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-violet-200 via-white to-fuchsia-200 bg-clip-text text-transparent">
                Simple. Beautiful. Functional.
              </h2>
              <p className="text-center text-violet-200 mb-16 font-light text-lg">
                Everything you need to manage your music collection
              </p>
            </motion.div>
            
            <motion.div 
              className="grid md:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {/* Feature 1 */}
              <motion.div 
                className="group relative bg-slate-900/60 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-violet-800/30 overflow-hidden cursor-pointer"
                variants={fadeInUp}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/0 to-violet-600/0 group-hover:from-violet-600/20 group-hover:to-transparent transition-all duration-500" />
                <motion.div 
                  className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"
                  initial={false}
                />
                
                <motion.div 
                  className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center mb-6 shadow-lg shadow-violet-700/50"
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <ListMusic className="w-8 h-8 text-white" />
                </motion.div>
                
                <h3 className="relative text-2xl font-semibold mb-3 text-white group-hover:text-violet-200 transition-colors">
                  Create Playlists
                </h3>
                <p className="relative text-violet-200 font-light leading-relaxed">
                  Organize your music into beautiful playlists with custom cover images
                </p>
              </motion.div>

              {/* Feature 2 */}
              <motion.div 
                className="group relative bg-slate-900/60 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-fuchsia-800/30 overflow-hidden cursor-pointer"
                variants={fadeInUp}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/0 to-fuchsia-600/0 group-hover:from-fuchsia-600/20 group-hover:to-transparent transition-all duration-500" />
                <motion.div 
                  className="absolute -inset-1 bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"
                  initial={false}
                />
                
                <motion.div 
                  className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-600 to-pink-600 flex items-center justify-center mb-6 shadow-lg shadow-fuchsia-700/50"
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Music className="w-8 h-8 text-white" />
                </motion.div>
                
                <h3 className="relative text-2xl font-semibold mb-3 text-white group-hover:text-fuchsia-200 transition-colors">
                  Add Tracks
                </h3>
                <p className="relative text-fuchsia-200 font-light leading-relaxed">
                  Add tracks via URL or upload audio files directly to your playlists
                </p>
              </motion.div>

              {/* Feature 3 */}
              <motion.div 
                className="group relative bg-slate-900/60 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-purple-800/30 overflow-hidden cursor-pointer"
                variants={fadeInUp}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/0 group-hover:from-purple-600/20 group-hover:to-transparent transition-all duration-500" />
                <motion.div 
                  className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"
                  initial={false}
                />
                
                <motion.div 
                  className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center mb-6 shadow-lg shadow-purple-700/50"
                  animate={{
                    boxShadow: [
                      "0 10px 30px rgba(147, 51, 234, 0.3)",
                      "0 10px 40px rgba(147, 51, 234, 0.5)",
                      "0 10px 30px rgba(147, 51, 234, 0.3)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>
                
                <h3 className="relative text-2xl font-semibold mb-3 text-white group-hover:text-purple-200 transition-colors">
                  Immersive Interface
                </h3>
                <p className="relative text-purple-200 font-light leading-relaxed">
                  Enjoy a beautiful, cinematic experience with a modern dark design
                </p>
              </motion.div>
            </motion.div>
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
