import React from 'react';
import { ArrowRight, Music, ListMusic, Sparkles, Disc3 } from 'lucide-react';

const PreviewRetro = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50">
      {/* Retro Navbar */}
      <nav className="bg-gradient-to-r from-orange-500 to-pink-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Disc3 className="w-10 h-10 text-yellow-300 animate-spin" style={{ animationDuration: '3s' }} />
            <span className="text-white font-bold text-xl" style={{ fontFamily: 'Courier New, monospace' }}>RETRO MUSIC</span>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded bg-yellow-400 text-orange-900 font-bold hover:bg-yellow-300 transition-all shadow-md">Home</button>
            <button className="px-4 py-2 rounded bg-white/20 text-white font-bold hover:bg-white/30 transition-all">Playlists</button>
            <button className="px-4 py-2 rounded bg-white/20 text-white font-bold hover:bg-white/30 transition-all">Settings</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="py-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-orange-200 rounded-full text-orange-900 mb-8 font-bold border-4 border-orange-400">
            <Disc3 className="w-5 h-5" />
            <span>MUSIC-THEMED RETRO</span>
          </div>
          
          <h1 className="text-7xl font-black mb-6 text-orange-600" style={{ fontFamily: 'Courier New, monospace', textShadow: '4px 4px 0px #FED7AA' }}>
            Groove to the<br />
            <span className="text-pink-600">Classic Vibes</span>
          </h1>
          
          <p className="text-xl text-orange-800 mb-10 font-semibold">
            Where vintage cassettes meet modern technology 📼🎵
          </p>

          <button className="group px-10 py-5 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-400 hover:to-orange-400 text-white rounded-lg font-black text-lg transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center gap-3 mx-auto border-4 border-orange-600">
            <Disc3 className="w-6 h-6" />
            <span>SPIN THE RECORDS</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>

      {/* Feature Cards - Cassette Style */}
      <div className="max-w-6xl mx-auto px-8 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1 - Cassette Style */}
          <div className="bg-gradient-to-br from-orange-400 to-red-400 rounded-lg p-8 shadow-xl transform hover:scale-105 hover:rotate-1 transition-all border-4 border-orange-600">
            <div className="bg-white rounded p-4 mb-4 border-2 border-orange-800">
              <div className="flex gap-2 justify-center mb-2">
                <div className="w-12 h-12 rounded-full border-4 border-orange-800 bg-yellow-300"></div>
                <div className="w-12 h-12 rounded-full border-4 border-orange-800 bg-yellow-300"></div>
              </div>
              <div className="h-1 bg-orange-800 mb-1"></div>
              <div className="h-1 bg-orange-800"></div>
            </div>
            <h3 className="text-2xl font-black mb-2 text-white" style={{ fontFamily: 'Courier New, monospace' }}>SIDE A</h3>
            <h4 className="text-xl font-bold mb-3 text-yellow-200">Playlists</h4>
            <p className="text-white font-semibold">
              Create mixtapes like the good old days
            </p>
          </div>

          {/* Card 2 - Vinyl Style */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-8 shadow-xl transform hover:scale-105 hover:-rotate-1 transition-all border-4 border-purple-700">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center border-4 border-purple-900 shadow-2xl">
              <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-yellow-600"></div>
            </div>
            <h3 className="text-2xl font-black mb-2 text-white" style={{ fontFamily: 'Courier New, monospace' }}>VINYL</h3>
            <h4 className="text-xl font-bold mb-3 text-yellow-200">Tracks</h4>
            <p className="text-white font-semibold">
              Spin your favorite records digitally
            </p>
          </div>

          {/* Card 3 - Radio Style */}
          <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-lg p-8 shadow-xl transform hover:scale-105 hover:rotate-1 transition-all border-4 border-yellow-600">
            <div className="bg-orange-800 rounded-lg p-4 mb-4 border-2 border-orange-900">
              <div className="grid grid-cols-3 gap-1 mb-2">
                <div className="h-2 bg-yellow-300 rounded"></div>
                <div className="h-2 bg-yellow-300 rounded"></div>
                <div className="h-2 bg-yellow-300 rounded"></div>
              </div>
              <div className="h-1 bg-yellow-500 rounded-full mb-1"></div>
            </div>
            <h3 className="text-2xl font-black mb-2 text-orange-900" style={{ fontFamily: 'Courier New, monospace' }}>RADIO</h3>
            <h4 className="text-xl font-bold mb-3 text-orange-800">Vibes</h4>
            <p className="text-orange-900 font-semibold">
              Tune into your music collection
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewRetro;