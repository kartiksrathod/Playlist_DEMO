import React from 'react';
import { ArrowRight, Music, ListMusic, Sparkles } from 'lucide-react';

const PreviewNeon = () => {
  return (
    <div className="min-h-screen bg-black">
      {/* Neon Navbar */}
      <nav className="bg-gray-900 border-b border-cyan-500/30 shadow-lg shadow-cyan-500/20">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-500/50">
              <ListMusic className="w-6 h-6 text-white" />
            </div>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-bold text-xl">NEON MUSIC</span>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg bg-gray-800 text-cyan-400 hover:bg-gray-700 transition-all border border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/50">Home</button>
            <button className="px-4 py-2 rounded-lg bg-gray-800 text-purple-400 hover:bg-gray-700 transition-all border border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/50">Playlists</button>
            <button className="px-4 py-2 rounded-lg bg-gray-800 text-pink-400 hover:bg-gray-700 transition-all border border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/50">Settings</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="py-32 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 rounded-full text-cyan-400 mb-8 border border-cyan-500 shadow-xl shadow-cyan-500/50">
            <Sparkles className="w-4 h-4" />
            <span className="font-semibold">DARK MODE + NEON ACCENTS</span>
          </div>
          
          <h1 className="text-7xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 drop-shadow-lg">
              Future of Music
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-10">
            Experience the futuristic neon-lit music manager
          </p>

          <button className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white rounded-xl font-semibold transition-all shadow-2xl shadow-purple-500/50 hover:shadow-cyan-500/50 flex items-center gap-2 mx-auto">
            <span>Enter the Future</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="max-w-6xl mx-auto px-8 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-900 rounded-2xl p-8 border border-cyan-500/30 shadow-xl shadow-cyan-500/20 hover:shadow-2xl hover:shadow-cyan-500/40 transition-all hover:-translate-y-2">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/50">
              <ListMusic className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-cyan-400">Neon Playlists</h3>
            <p className="text-gray-400 leading-relaxed">
              Create playlists that glow with style
            </p>
          </div>

          <div className="bg-gray-900 rounded-2xl p-8 border border-purple-500/30 shadow-xl shadow-purple-500/20 hover:shadow-2xl hover:shadow-purple-500/40 transition-all hover:-translate-y-2">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/50">
              <Music className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-purple-400">Electric Tracks</h3>
            <p className="text-gray-400 leading-relaxed">
              Add music with electrifying speed
            </p>
          </div>

          <div className="bg-gray-900 rounded-2xl p-8 border border-pink-500/30 shadow-xl shadow-pink-500/20 hover:shadow-2xl hover:shadow-pink-500/40 transition-all hover:-translate-y-2">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-6 shadow-lg shadow-pink-500/50">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-pink-400">Cyber Interface</h3>
            <p className="text-gray-400 leading-relaxed">
              Navigate through a futuristic UI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewNeon;