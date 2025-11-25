import React from 'react';
import { ArrowRight, Play, Volume2, Heart, Share2 } from 'lucide-react';

const PreviewPremium = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Premium Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <span className="text-2xl font-light tracking-wider">SOUNDWAVE</span>
            <div className="hidden md:flex gap-8 text-sm font-light text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Music</a>
              <a href="#" className="hover:text-white transition-colors">Playlists</a>
              <a href="#" className="hover:text-white transition-colors">Library</a>
              <a href="#" className="hover:text-white transition-colors">About</a>
            </div>
          </div>
          <button className="px-6 py-2.5 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-200 transition-all">
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section - Large Product Style */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-600/10 via-transparent to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-block px-4 py-1.5 bg-white/5 backdrop-blur-sm rounded-full text-xs font-light text-gray-300 border border-white/10">
              NEW COLLECTION
            </div>
            
            <h1 className="text-7xl md:text-8xl font-light tracking-tight leading-none">
              Pure
              <br />
              <span className="font-normal">Sound.</span>
            </h1>
            
            <p className="text-xl text-gray-400 font-light max-w-md leading-relaxed">
              Experience music the way artists intended. Crystal clear audio, 
              immersive soundstage, premium comfort.
            </p>

            <div className="flex gap-4 pt-4">
              <button className="group px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition-all flex items-center gap-3 shadow-2xl">
                <span>Explore Collection</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 border border-white/20 rounded-full font-medium hover:bg-white/5 transition-all flex items-center gap-3">
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-12 pt-8 border-t border-white/10">
              <div>
                <div className="text-3xl font-light">40h</div>
                <div className="text-sm text-gray-500 font-light">Battery Life</div>
              </div>
              <div>
                <div className="text-3xl font-light">Hi-Res</div>
                <div className="text-sm text-gray-500 font-light">Audio Quality</div>
              </div>
              <div>
                <div className="text-3xl font-light">ANC</div>
                <div className="text-sm text-gray-500 font-light">Noise Cancel</div>
              </div>
            </div>
          </div>

          {/* Right - Product Image Placeholder */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-3xl rounded-full"></div>
            <div className="relative aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl border border-white/10 flex items-center justify-center shadow-2xl">
              <div className="text-center space-y-4">
                <Volume2 className="w-32 h-32 mx-auto text-white/20" strokeWidth={0.5} />
                <div className="text-sm text-gray-500 font-light">Premium Headphones</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-light mb-6">Designed for perfection</h2>
            <p className="text-xl text-gray-400 font-light">Every detail matters in your music experience</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative bg-white/5 backdrop-blur-sm rounded-3xl p-10 border border-white/10 hover:border-white/20 transition-all hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white/20 transition-colors">
                  <Volume2 className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-light mb-4">Studio Quality</h3>
                <p className="text-gray-400 font-light leading-relaxed">
                  Professional-grade audio drivers deliver pristine sound reproduction across all frequencies.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-white/5 backdrop-blur-sm rounded-3xl p-10 border border-white/10 hover:border-white/20 transition-all hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white/20 transition-colors">
                  <Heart className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-light mb-4">All-Day Comfort</h3>
                <p className="text-gray-400 font-light leading-relaxed">
                  Premium materials and ergonomic design ensure comfort during extended listening sessions.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-white/5 backdrop-blur-sm rounded-3xl p-10 border border-white/10 hover:border-white/20 transition-all hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white/20 transition-colors">
                  <Share2 className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-light mb-4">Seamless Connection</h3>
                <p className="text-gray-400 font-light leading-relaxed">
                  Instant pairing and stable connectivity with all your devices. No interruptions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Playlist Collection Section */}
      <section className="relative py-32 px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-5xl font-light mb-4">Your Collection</h2>
              <p className="text-xl text-gray-400 font-light">Curated playlists for every mood</p>
            </div>
            <button className="text-sm font-light text-gray-400 hover:text-white transition-colors flex items-center gap-2">
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="group cursor-pointer">
                <div className="relative aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl mb-4 overflow-hidden border border-white/10 hover:border-white/20 transition-all">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all shadow-2xl">
                      <Play className="w-5 h-5 text-black ml-0.5" fill="black" />
                    </div>
                  </div>
                </div>
                <h3 className="font-light mb-1 group-hover:text-white transition-colors">Playlist {item}</h3>
                <p className="text-sm text-gray-500 font-light">12 tracks • 45 min</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-6xl font-light mb-8 leading-tight">
            Elevate your<br />music experience
          </h2>
          <p className="text-xl text-gray-400 font-light mb-12 max-w-2xl mx-auto">
            Join thousands of music lovers who trust SOUNDWAVE for the ultimate listening experience.
          </p>
          <button className="px-10 py-5 bg-white text-black rounded-full text-lg font-medium hover:bg-gray-100 transition-all shadow-2xl">
            Start Your Journey
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-gray-500 font-light">
          <div>© 2024 SOUNDWAVE. Premium Audio Experience.</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PreviewPremium;
