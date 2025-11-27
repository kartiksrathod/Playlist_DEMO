import React, { useState, useEffect } from 'react';
import { Heart, Music, ListMusic, Play, Clock, Loader2 } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Favorites = () => {
  const [activeTab, setActiveTab] = useState('playlists');
  const [playlists, setPlaylists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavorites();
  }, [activeTab]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      if (activeTab === 'playlists') {
        const response = await axios.get(`${API}/favorites/playlists`);
        setPlaylists(response.data.playlists || []);
      } else {
        const response = await axios.get(`${API}/favorites/tracks`);
        setTracks(response.data.tracks || []);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePlaylist = async (playlistId, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`${API}/favorites/playlists/${playlistId}`);
      toast.success('Removed from favorites');
      fetchFavorites();
    } catch (error) {
      console.error('Error removing playlist:', error);
      toast.error('Failed to remove from favorites');
    }
  };

  const handleRemoveTrack = async (trackId, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`${API}/favorites/tracks/${trackId}`);
      toast.success('Removed from favorites');
      fetchFavorites();
    } catch (error) {
      console.error('Error removing track:', error);
      toast.error('Failed to remove from favorites');
    }
  };

  const getImageUrl = (coverImage) => {
    if (!coverImage) return null;
    return `${BACKEND_URL}${coverImage}`;
  };

  const formatDuration = (duration) => {
    if (!duration) return '0:00';
    // If duration is already formatted (mm:ss), return as is
    if (typeof duration === 'string' && duration.includes(':')) {
      return duration;
    }
    // If duration is in seconds, convert to mm:ss
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-slate-950 px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-700/50">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <h1 className="text-4xl font-light text-white">Favorites</h1>
            </div>
            <p className="text-blue-100 text-lg font-light">Your most loved music collection</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 bg-slate-900/60 backdrop-blur-xl rounded-2xl p-2 border border-pink-800/30 w-fit">
            <button
              onClick={() => setActiveTab('playlists')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'playlists'
                  ? 'bg-pink-700/40 text-pink-100 border border-pink-600/30 shadow-lg shadow-pink-700/30'
                  : 'text-blue-100 hover:bg-slate-800/50'
              }`}
            >
              <ListMusic className="w-4 h-4" />
              <span>Playlists</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'playlists' 
                  ? 'bg-pink-600/40 text-pink-100' 
                  : 'bg-slate-800 text-blue-200'
              }`}>
                {playlists.length}
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('tracks')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'tracks'
                  ? 'bg-pink-700/40 text-pink-100 border border-pink-600/30 shadow-lg shadow-pink-700/30'
                  : 'text-blue-100 hover:bg-slate-800/50'
              }`}
            >
              <Music className="w-4 h-4" />
              <span>Tracks</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === 'tracks' 
                  ? 'bg-pink-600/40 text-pink-100' 
                  : 'bg-slate-800 text-blue-200'
              }`}>
                {tracks.length}
              </span>
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-pink-400 animate-spin" />
            </div>
          )}

          {/* Favorite Playlists Grid */}
          {!loading && activeTab === 'playlists' && playlists.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  onClick={() => navigate(`/playlists/${playlist.id}`)}
                  className="group bg-slate-900/60 backdrop-blur-xl rounded-2xl overflow-hidden border border-pink-800/30 hover:border-pink-600/50 transition-all cursor-pointer hover:shadow-2xl hover:shadow-pink-600/30"
                >
                  {/* Playlist Cover */}
                  <div className="relative h-48 overflow-hidden">
                    {getImageUrl(playlist.coverImage) ? (
                      <img
                        src={getImageUrl(playlist.coverImage)}
                        alt={playlist.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center">
                        <ListMusic className="w-16 h-16 text-white/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent opacity-90" />
                    
                    {/* Heart Icon */}
                    <button 
                      onClick={(e) => handleRemovePlaylist(playlist.id, e)}
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-pink-700/40 backdrop-blur-sm border border-pink-600/30 flex items-center justify-center hover:bg-pink-600/50 transition-all group/heart"
                    >
                      <Heart className="w-5 h-5 text-pink-200 fill-pink-200" />
                    </button>

                    {/* Track Count Badge */}
                    <div className="absolute bottom-4 left-4 px-3 py-1 bg-slate-900/80 backdrop-blur-sm rounded-full text-white text-sm border border-pink-600/30">
                      {playlist.trackCount || 0} tracks
                    </div>
                  </div>

                  {/* Playlist Info */}
                  <div className="p-5">
                    <h3 className="text-white font-medium text-lg mb-2 group-hover:text-pink-300 transition-colors">
                      {playlist.name}
                    </h3>
                    <p className="text-blue-200 text-sm mb-3 line-clamp-2">
                      {playlist.description || 'No description'}
                    </p>
                    <div className="flex items-center justify-between text-xs text-blue-300">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {playlist.trackCount || 0} songs
                      </span>
                      <span className="text-pink-300">
                        Added {new Date(playlist.addedToFavoritesAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Favorite Tracks List */}
          {!loading && activeTab === 'tracks' && tracks.length > 0 && (
            <div className="space-y-3">
              {tracks.map((track, index) => (
                <div
                  key={track.id}
                  className="bg-slate-900/60 backdrop-blur-xl rounded-xl p-5 border border-pink-800/30 hover:border-pink-600/50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    {/* Track Number */}
                    <div className="w-8 text-center">
                      <span className="text-blue-200 text-sm font-medium">{index + 1}</span>
                    </div>

                    {/* Album Art Placeholder */}
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-700/40 flex-shrink-0">
                      {getImageUrl(track.playlistCover) ? (
                        <img
                          src={getImageUrl(track.playlistCover)}
                          alt={track.songName}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Music className="w-6 h-6 text-white" />
                      )}
                    </div>

                    {/* Track Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium mb-1 truncate group-hover:text-pink-300 transition-colors">
                        {track.songName}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-blue-200">
                        <span className="truncate">{track.artist || 'Unknown Artist'}</span>
                        {track.playlistName && (
                          <>
                            <span className="text-pink-500">•</span>
                            <span className="truncate">{track.playlistName}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="hidden sm:block text-blue-200 text-sm w-16 text-right">
                      {formatDuration(track.duration)}
                    </div>

                    {/* Heart Button */}
                    <button
                      onClick={(e) => handleRemoveTrack(track.id, e)}
                      className="w-10 h-10 rounded-full bg-pink-700/40 backdrop-blur-sm border border-pink-600/30 flex items-center justify-center hover:bg-pink-600/50 transition-all flex-shrink-0"
                    >
                      <Heart className="w-5 h-5 text-pink-200 fill-pink-200" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && ((activeTab === 'playlists' && playlists.length === 0) ||
            (activeTab === 'tracks' && tracks.length === 0)) && (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-slate-900/60 backdrop-blur-xl flex items-center justify-center mx-auto mb-6 border border-pink-800/30">
                <Heart className="w-10 h-10 text-pink-400" />
              </div>
              <h3 className="text-2xl font-light text-white mb-2">No favorites yet</h3>
              <p className="text-blue-100 mb-6">
                {activeTab === 'playlists' 
                  ? 'Start adding playlists to your favorites' 
                  : 'Start adding tracks to your favorites'}
              </p>
              <button
                onClick={() => navigate(activeTab === 'playlists' ? '/playlists' : '/library')}
                className="px-6 py-3 bg-pink-700 hover:bg-pink-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-pink-700/30"
              >
                {activeTab === 'playlists' ? 'Browse Playlists' : 'Browse Library'}
              </button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Favorites;
