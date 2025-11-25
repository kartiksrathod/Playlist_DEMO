import React from 'react';
import { ArrowRight, Music, ListMusic, Sparkles } from 'lucide-react';

const PreviewGlass = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400">
      {/* Glassmorphism Navbar */}
      <nav className="fixed top-0 left-0 right-0 backdrop-blur-lg bg-white/10 border-b border-white/20 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <ListMusic className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-semibold text-lg">Music Manager</span>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-all">Home</button>
            <button className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-all">Playlists</button>
            <button className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-all">Settings</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md rounded-full text-white mb-8 border border-white/30">
            <Sparkles className="w-4 h-4" />
            <span>Glassmorphism Design</span>
          </div>
          
          <h1 className="text-7xl font-bold text-white mb-6 drop-shadow-lg">
            Beautiful Music<br />Experience
          </h1>
          
          <p className="text-xl text-white/90 mb-10 drop-shadow">
            Organize your music with stunning glassmorphism design
          </p>

          <button className="group px-8 py-4 bg-white/30 backdrop-blur-md hover:bg-white/40 text-white rounded-2xl font-semibold transition-all shadow-xl hover:shadow-2xl flex items-center gap-2 mx-auto border border-white/40">
            <span>Explore Now</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="max-w-6xl mx-auto px-8 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="backdrop-blur-lg bg-white/20 rounded-3xl p-8 border border-white/30 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
            <div className="w-16 h-16 rounded-2xl bg-white/30 backdrop-blur-md flex items-center justify-center mb-6">
              <ListMusic className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-white">Create Playlists</h3>
            <p className="text-white/80 leading-relaxed">
              Organize your favorite tracks into beautiful playlists
            </p>
          </div>

          <div className="backdrop-blur-lg bg-white/20 rounded-3xl p-8 border border-white/30 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
            <div className="w-16 h-16 rounded-2xl bg-white/30 backdrop-blur-md flex items-center justify-center mb-6">
              <Music className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-white">Add Tracks</h3>
            <p className="text-white/80 leading-relaxed">
              Upload your music or add from streaming URLs
            </p>
          </div>

          <div className="backdrop-blur-lg bg-white/20 rounded-3xl p-8 border border-white/30 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
            <div className="w-16 h-16 rounded-2xl bg-white/30 backdrop-blur-md flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-white">Premium Design</h3>
            <p className="text-white/80 leading-relaxed">
              Enjoy a modern, glass-effect interface
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewGlass;