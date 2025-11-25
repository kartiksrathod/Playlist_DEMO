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
      <div className="min-h-screen bg-slate-950">
        {/* Hero Section with Video Background */}
        <div className="relative h-[70vh] overflow-hidden">
          {/* Video Background */}
          <div className="absolute inset-0">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="https://cdn.pixabay.com/video/2023/08/21/176927-857535222_large.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-950/80 via-slate-900/70 to-blue-900/80" />
          </div>

          {/* Hero Content */}
          <div className="relative h-full flex flex-col items-center justify-center px-4 text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 backdrop-blur-md rounded-full text-sm mb-6 border border-blue-400/30">
              <Sparkles className="w-4 h-4 text-blue-300" />
              <span className="text-blue-100">Your music, beautifully organized</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-light text-center mb-6 tracking-tight text-white">
              Music Playlist<br />Manager
            </h1>
            
            <p className="text-xl text-blue-100 text-center mb-10 max-w-2xl font-light">
              Create, organize, and manage your music playlists with an immersive interface
            </p>

            <a href="/playlists">
              <button className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl hover:shadow-blue-500/50 flex items-center gap-2">
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </a>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20 px-4 bg-slate-900">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-light text-center mb-4 text-white">Simple. Beautiful. Functional.</h2>
            <p className="text-center text-blue-200 mb-16 font-light">Everything you need to manage your music collection</p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-sm hover:shadow-md hover:shadow-blue-500/20 transition-all border border-slate-700/50">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-6">
                  <ListMusic className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-medium mb-3 text-white">Create Playlists</h3>
                <p className="text-blue-200 font-light leading-relaxed">
                  Organize your music into beautiful playlists with custom cover images
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-sm hover:shadow-md hover:shadow-blue-500/20 transition-all border border-slate-700/50">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-6">
                  <Music className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-medium mb-3 text-white">Add Tracks</h3>
                <p className="text-blue-200 font-light leading-relaxed">
                  Add tracks via URL or upload audio files directly to your playlists
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-sm hover:shadow-md hover:shadow-blue-500/20 transition-all border border-slate-700/50">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-medium mb-3 text-white">Immersive Interface</h3>
                <p className="text-blue-200 font-light leading-relaxed">
                  Enjoy a beautiful, cinematic experience with a modern dark design
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
