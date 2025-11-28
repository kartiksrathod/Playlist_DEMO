import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  ArrowLeft,
  Play,
  Pause,
  Music,
  User,
  Album,
  Clock,
  FileAudio,
  Link as LinkIcon,
  Disc3,
  Plus,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/context/ThemeContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const TrackDetail = () => {
  const { themeConfig } = useTheme();
  const { trackId } = useParams();
  const navigate = useNavigate();
  const audioRef = useRef(null);

  const [track, setTrack] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [relatedTracks, setRelatedTracks] = useState({ byArtist: [], byAlbum: [] });
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAddToPlaylist, setShowAddToPlaylist] = useState(false);
  const [allPlaylists, setAllPlaylists] = useState([]);

  useEffect(() => {
    fetchTrackDetails();
    fetchAllPlaylists();
  }, [trackId]);

  const fetchTrackDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/library/tracks/${trackId}`);
      setTrack(response.data.track);
      setPlaylists(response.data.foundInPlaylists);
      setRelatedTracks(response.data.relatedTracks);
    } catch (error) {
      console.error('Error fetching track details:', error);
      toast.error('Failed to load track details');
      navigate('/library');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPlaylists = async () => {
    try {
      const response = await axios.get(`${API}/playlists`);
      setAllPlaylists(response.data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAddToPlaylist = async (playlistId) => {
    try {
      // Create a copy of the track in the selected playlist
      const trackData = {
        songName: track.songName,
        artist: track.artist,
        album: track.album,
        duration: track.duration,
        audioUrl: track.audioUrl,
      };

      await axios.post(`${API}/playlists/${playlistId}/tracks`, trackData);
      toast.success('Track added to playlist!');
      setShowAddToPlaylist(false);
    } catch (error) {
      console.error('Error adding track to playlist:', error);
      toast.error('Failed to add track to playlist');
    }
  };

  const handleRelatedTrackClick = (relatedTrackId) => {
    navigate(`/library/track/${relatedTrackId}`);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (!track) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-white mb-2">Track not found</h2>
          <button
            onClick={() => navigate('/library')}
            className="text-indigo-400 hover:text-indigo-300"
          >
            Return to Library
          </button>
        </div>
      </div>
    );
  }

  const audioSource = track.audioFile
    ? `${BACKEND_URL}${track.audioFile}`
    : track.audioUrl;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-indigo-900/60 via-slate-900/60 to-purple-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <motion.button
            onClick={() => navigate('/library')}
            className="flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05, x: -5 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Library</span>
          </motion.button>

          {/* Track Hero */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Cover Image */}
            <motion.div 
              className="relative w-64 h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-600/20 to-purple-600/20 flex-shrink-0 shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ scale: 1.05, rotate: 2 }}
            >
              {track.playlistCover ? (
                <img
                  src={`${BACKEND_URL}${track.playlistCover}`}
                  alt={track.songName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music className="w-24 h-24 text-indigo-400/50" />
                </div>
              )}
            </motion.div>

            {/* Track Info */}
            <motion.div 
              className="flex-1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="mb-4">
                <motion.div 
                  className="flex items-center gap-2 mb-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="px-3 py-1 bg-indigo-600/30 backdrop-blur-sm rounded-full text-sm text-indigo-300 border border-indigo-500/30">
                    Track
                  </span>
                  {track.audioFile ? (
                    <div className="flex items-center gap-1 px-3 py-1 bg-green-600/30 backdrop-blur-sm rounded-full text-sm text-green-300 border border-green-500/30">
                      <FileAudio className="w-4 h-4" />
                      <span>Uploaded File</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 px-3 py-1 bg-blue-600/30 backdrop-blur-sm rounded-full text-sm text-blue-300 border border-blue-500/30">
                      <LinkIcon className="w-4 h-4" />
                      <span>External URL</span>
                    </div>
                  )}
                </motion.div>
                <motion.h1 
                  className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {track.songName}
                </motion.h1>
              </div>

              {/* Metadata Grid */}
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {track.artist && (
                  <motion.div 
                    className="flex items-center gap-3 p-4 bg-slate-900/60 backdrop-blur-sm rounded-xl border border-indigo-800/20"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <div className="p-2 bg-indigo-600/20 rounded-lg">
                      <User className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Artist</div>
                      <div className="text-white font-medium">{track.artist}</div>
                    </div>
                  </motion.div>
                )}

                {track.album && (
                  <motion.div 
                    className="flex items-center gap-3 p-4 bg-slate-900/60 backdrop-blur-sm rounded-xl border border-purple-800/20"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.65 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <div className="p-2 bg-purple-600/20 rounded-lg">
                      <Album className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Album</div>
                      <div className="text-white font-medium">{track.album}</div>
                    </div>
                  </motion.div>
                )}

                {track.duration && (
                  <motion.div 
                    className="flex items-center gap-3 p-4 bg-slate-900/60 backdrop-blur-sm rounded-xl border border-blue-800/20"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <div className="p-2 bg-blue-600/20 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Duration</div>
                      <div className="text-white font-medium">{track.duration}</div>
                    </div>
                  </motion.div>
                )}

                <motion.div 
                  className="flex items-center gap-3 p-4 bg-slate-900/60 backdrop-blur-sm rounded-xl border border-cyan-800/20"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.75 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <div className="p-2 bg-cyan-600/20 rounded-lg">
                    <Disc3 className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Playlist</div>
                    <div className="text-white font-medium">{track.playlistName}</div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div 
                className="flex gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                {audioSource && (
                  <motion.button
                    onClick={togglePlayPause}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/30"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-5 h-5" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        <span>Play</span>
                      </>
                    )}
                  </motion.button>
                )}

                <motion.button
                  onClick={() => setShowAddToPlaylist(!showAddToPlaylist)}
                  className="px-6 py-3 bg-slate-800/60 hover:bg-slate-700/60 text-white rounded-xl font-medium transition-all flex items-center gap-2 border border-slate-700/50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-5 h-5" />
                  <span>Add to Playlist</span>
                </motion.button>

                {track.audioUrl && (
                  <motion.a
                    href={track.audioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-slate-800/60 hover:bg-slate-700/60 text-white rounded-xl font-medium transition-all flex items-center gap-2 border border-slate-700/50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span className="hidden sm:inline">Open URL</span>
                  </motion.a>
                )}
              </motion.div>

              {/* Hidden Audio Player */}
              {audioSource && (
                <audio
                  ref={audioRef}
                  src={audioSource}
                  onEnded={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="hidden"
                />
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Add to Playlist Dialog */}
      {showAddToPlaylist && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-indigo-800/30">
            <h3 className="text-lg font-semibold text-white mb-4">Add to Playlist</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {allPlaylists
                .filter((pl) => !playlists.some((p) => p.id === pl.id))
                .map((playlist) => (
                  <button
                    key={playlist.id}
                    onClick={() => handleAddToPlaylist(playlist.id)}
                    className="flex items-center gap-3 p-3 bg-slate-800/60 hover:bg-slate-700/60 rounded-xl transition-all text-left border border-slate-700/50 hover:border-indigo-600/50"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-600/20 to-purple-600/20 flex items-center justify-center flex-shrink-0">
                      {playlist.coverImage ? (
                        <img
                          src={`${BACKEND_URL}${playlist.coverImage}`}
                          alt={playlist.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Music className="w-6 h-6 text-indigo-400" />
                      )}
                    </div>
                    <span className="text-white font-medium truncate">{playlist.name}</span>
                  </button>
                ))}
              {allPlaylists.filter((pl) => !playlists.some((p) => p.id === pl.id)).length === 0 && (
                <p className="text-slate-400 col-span-full text-center py-4">
                  This track is already in all your playlists
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Found in Playlists Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Found in Playlists</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                onClick={() => navigate(`/playlists/${playlist.id}`)}
                className="group flex items-center gap-4 p-4 bg-slate-900/60 backdrop-blur-sm rounded-xl border border-indigo-800/20 hover:border-indigo-600/40 hover:bg-slate-800/60 transition-all cursor-pointer"
              >
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-indigo-600/20 to-purple-600/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {playlist.coverImage ? (
                    <img
                      src={`${BACKEND_URL}${playlist.coverImage}`}
                      alt={playlist.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Disc3 className="w-8 h-8 text-indigo-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white group-hover:text-indigo-400 transition-colors truncate">
                    {playlist.name}
                  </h3>
                  {playlist.description && (
                    <p className="text-sm text-slate-400 truncate">{playlist.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* More from Artist Section */}
        {relatedTracks.byArtist.length > 0 && track.artist && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              More from <span className="text-indigo-400">{track.artist}</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {relatedTracks.byArtist.map((relatedTrack) => (
                <div
                  key={relatedTrack.id}
                  onClick={() => handleRelatedTrackClick(relatedTrack.id)}
                  className="group bg-slate-900/60 backdrop-blur-sm rounded-xl overflow-hidden border border-indigo-800/20 hover:border-indigo-600/40 transition-all cursor-pointer hover:scale-105"
                >
                  <div className="relative aspect-square bg-gradient-to-br from-indigo-600/20 to-purple-600/20">
                    {relatedTrack.playlistCover ? (
                      <img
                        src={`${BACKEND_URL}${relatedTrack.playlistCover}`}
                        alt={relatedTrack.songName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Music className="w-12 h-12 text-indigo-400/50" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-white text-sm mb-1 truncate group-hover:text-indigo-400 transition-colors">
                      {relatedTrack.songName}
                    </h3>
                    <p className="text-xs text-slate-400 truncate">{relatedTrack.playlistName}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* More from Album Section */}
        {relatedTracks.byAlbum.length > 0 && track.album && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              More from <span className="text-purple-400">{track.album}</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {relatedTracks.byAlbum.map((relatedTrack) => (
                <div
                  key={relatedTrack.id}
                  onClick={() => handleRelatedTrackClick(relatedTrack.id)}
                  className="group bg-slate-900/60 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-800/20 hover:border-purple-600/40 transition-all cursor-pointer hover:scale-105"
                >
                  <div className="relative aspect-square bg-gradient-to-br from-purple-600/20 to-pink-600/20">
                    {relatedTrack.playlistCover ? (
                      <img
                        src={`${BACKEND_URL}${relatedTrack.playlistCover}`}
                        alt={relatedTrack.songName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Music className="w-12 h-12 text-purple-400/50" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-white text-sm mb-1 truncate group-hover:text-purple-400 transition-colors">
                      {relatedTrack.songName}
                    </h3>
                    <p className="text-xs text-slate-400 truncate">{relatedTrack.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackDetail;
