import React, { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { Toaster } from "sonner";
import Playlists from "@/pages/Playlists";
import PlaylistDetail from "@/pages/PlaylistDetail";
import Settings from "@/pages/Settings";
import Profile from "@/pages/Profile";
import AppLayout from "@/components/AppLayout";
import PreviewGlass from "@/pages/PreviewGlass";
import PreviewVibrant from "@/pages/PreviewVibrant";
import PreviewNeon from "@/pages/PreviewNeon";
import PreviewRetro from "@/pages/PreviewRetro";
import PreviewMesh from "@/pages/PreviewMesh";
import PreviewPremium from "@/pages/PreviewPremium";
import { ArrowRight, Music, ListMusic, Sparkles } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const helloWorldApi = async () => {
    try {
      const response = await axios.get(`${API}/`);
      console.log(response.data.message);
    } catch (e) {
      console.error(e, `errored out requesting / api`);
    }
  };

  useEffect(() => {
    helloWorldApi();
  }, []);

  return (
    <AppLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative h-[70vh] overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1707249935951-d92bf3a65b00?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHx3YXJtJTIwc3VucmlzZXxlbnwwfHx8b3JhbmdlfDE3NjQwOTY3MzN8MA&ixlib=rb-4.1.0&q=85"
              alt="Hero"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/50" />
          </div>

          {/* Hero Content */}
          <div className="relative h-full flex flex-col items-center justify-center px-4 text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Your music, beautifully organized</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-light text-center mb-6 tracking-tight">
              Music Playlist<br />Manager
            </h1>
            
            <p className="text-xl text-white/90 text-center mb-10 max-w-2xl font-light">
              Create, organize, and manage your music playlists with a clean, minimal interface
            </p>

            <a href="/playlists">
              <button className="group px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </a>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-light text-center mb-4 text-gray-800">Simple. Beautiful. Functional.</h2>
            <p className="text-center text-gray-600 mb-16 font-light">Everything you need to manage your music collection</p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-6">
                  <ListMusic className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-medium mb-3 text-gray-800">Create Playlists</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  Organize your music into beautiful playlists with custom cover images
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-6">
                  <Music className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-medium mb-3 text-gray-800">Add Tracks</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  Add tracks via URL or upload audio files directly to your playlists
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-6">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-medium mb-3 text-gray-800">Clean Interface</h3>
                <p className="text-gray-600 font-light leading-relaxed">
                  Enjoy a minimal, distraction-free experience with a modern design
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

function App() {
  return (
    <div className="App">
      <Toaster position="top-center" richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/playlists/:playlistId" element={<PlaylistDetail />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/preview/glass" element={<PreviewGlass />} />
          <Route path="/preview/vibrant" element={<PreviewVibrant />} />
          <Route path="/preview/neon" element={<PreviewNeon />} />
          <Route path="/preview/retro" element={<PreviewRetro />} />
          <Route path="/preview/mesh" element={<PreviewMesh />} />
          <Route path="/preview/premium" element={<PreviewPremium />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
