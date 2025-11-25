import React from 'react';
import { ArrowRight, Music, ListMusic, Sparkles } from 'lucide-react';

const PreviewMesh = () => {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated Mesh Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-40 w-96 h-96 bg-gradient-to-br from-pink-400/30 to-orange-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Sleek Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <ListMusic className="w-6 h-6 text-white" />
            </div>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-bold text-xl">MusicFlow</span>
          </div>
          <div className="flex gap-2">
            <button className="px-5 py-2 rounded-xl text-gray-700 hover:bg-white/50 transition-all font-medium">Home</button>
            <button className="px-5 py-2 rounded-xl text-gray-700 hover:bg-white/50 transition-all font-medium">Playlists</button>
            <button className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg transition-all font-medium">Settings</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="py-32 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full text-purple-700 mb-8 font-medium shadow-lg border border-purple-200/50">
            <Sparkles className="w-4 h-4" />
            <span>Gradient Mesh Design</span>
          </div>
          
          <h1 className="text-7xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              Fluid Music
            </span>
            <br />
            <span className="text-gray-800">Experience</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Smooth, colorful, and modern - organize your music with Instagram & Spotify inspired design
          </p>

          <button className="group px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-2xl font-semibold transition-all shadow-xl hover:shadow-2xl flex items-center gap-2 mx-auto">
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="max-w-6xl mx-auto px-8 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <ListMusic className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-800">Smooth Playlists</h3>
            <p className="text-gray-600 leading-relaxed">
              Create beautiful playlists with fluid animations
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <Music className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-800">Seamless Upload</h3>
            <p className="text-gray-600 leading-relaxed">
              Add tracks with smooth, intuitive interface
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 text-gray-800">Modern Aesthetic</h3>
            <p className="text-gray-600 leading-relaxed">
              Enjoy a Instagram-inspired colorful design
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default PreviewMesh;