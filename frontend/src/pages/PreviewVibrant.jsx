import React from 'react';
import { ArrowRight, Music, ListMusic, Sparkles, Zap } from 'lucide-react';

const PreviewVibrant = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-pink-400 to-purple-500">
      {/* Bold Navbar */}
      <nav className="bg-gradient-to-r from-purple-600 to-pink-600 shadow-2xl">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-yellow-400 flex items-center justify-center transform rotate-12 shadow-xl">
              <ListMusic className="w-7 h-7 text-purple-600" />
            </div>
            <span className="text-white font-black text-2xl">MUSIC</span>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2 rounded-xl bg-yellow-400 text-purple-900 font-bold hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg">Home</button>
            <button className="px-5 py-2 rounded-xl bg-white/20 text-white font-bold hover:bg-white/30 transition-all transform hover:scale-105">Playlists</button>
            <button className="px-5 py-2 rounded-xl bg-white/20 text-white font-bold hover:bg-white/30 transition-all transform hover:scale-105">Settings</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="py-24 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 rounded-full text-purple-900 mb-8 font-bold shadow-xl transform -rotate-1 animate-pulse">
            <Zap className="w-5 h-5" />
            <span>BOLD & VIBRANT</span>
          </div>
          
          <h1 className="text-8xl font-black text-white mb-6 drop-shadow-2xl">
            ROCK YOUR<br />
            <span className="text-yellow-400">PLAYLISTS</span>
          </h1>
          
          <p className="text-2xl text-white font-bold mb-10 drop-shadow-lg">
            The most energetic music manager ever! 🎸🎵🔥
          </p>

          <button className="group px-10 py-5 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-purple-900 rounded-2xl font-black text-xl transition-all shadow-2xl hover:shadow-3xl transform hover:scale-110 flex items-center gap-3 mx-auto">
            <span>LET'S GO!</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="max-w-6xl mx-auto px-8 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl p-8 shadow-2xl transform hover:scale-105 hover:rotate-2 transition-all">
            <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-xl transform -rotate-6">
              <ListMusic className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-3xl font-black mb-3 text-white">CREATE!</h3>
            <p className="text-white font-semibold text-lg">
              Build awesome playlists in seconds! 🎵
            </p>
          </div>

          <div className="bg-gradient-to-br from-pink-500 to-rose-400 rounded-3xl p-8 shadow-2xl transform hover:scale-105 hover:-rotate-2 transition-all">
            <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-xl transform rotate-6">
              <Music className="w-10 h-10 text-pink-600" />
            </div>
            <h3 className="text-3xl font-black mb-3 text-white">UPLOAD!</h3>
            <p className="text-white font-semibold text-lg">
              Add your favorite tracks fast! 🚀
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-violet-400 rounded-3xl p-8 shadow-2xl transform hover:scale-105 hover:rotate-2 transition-all">
            <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-xl transform -rotate-6">
              <Sparkles className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-3xl font-black mb-3 text-white">ENJOY!</h3>
            <p className="text-white font-semibold text-lg">
              Party with amazing design! 🎉
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewVibrant;