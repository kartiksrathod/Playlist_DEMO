import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '../context/PlayerContext';
import { useTheme } from '../context/ThemeContext';
import {
  X,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Repeat1,
  Music,
} from 'lucide-react';

const FullPlayerModal = ({ isOpen, onClose }) => {
  const { themeConfig } = useTheme();
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    shuffle,
    repeat,
    queue,
    togglePlayPause,
    playNext,
    playPrevious,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    play,
  } = usePlayer();

  if (!isOpen || !currentTrack) return null;

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

  // Format time
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get cover image
  const getCoverImage = () => {
    if (currentTrack.coverImage) {
      return `${BACKEND_URL}${currentTrack.coverImage}`;
    }
    return 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800';
  };

  // Handle progress bar change
  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    seek(newTime);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className={`fixed inset-0 z-50 bg-gradient-to-br ${themeConfig.classes.gradient} overflow-auto`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Close Button */}
          <motion.button
            onClick={onClose}
            className={`absolute top-6 right-6 p-2 rounded-full ${themeConfig.classes.button.secondary} transition z-10`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-6 h-6" />
          </motion.button>

          <div className="min-h-screen flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-4xl">
              {/* Album Art */}
              <motion.div 
                className="flex justify-center mb-12"
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <motion.img
                  src={getCoverImage()}
                  alt={currentTrack.songName}
                  className="w-80 h-80 rounded-3xl shadow-2xl object-cover"
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>

              {/* Track Info */}
              <motion.div 
                className="text-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h1 className={`text-4xl font-bold ${themeConfig.classes.text.primary} mb-3`}>{currentTrack.songName}</h1>
                <p className={`text-xl ${themeConfig.classes.text.secondary}`}>{currentTrack.artist || 'Unknown Artist'}</p>
                {currentTrack.album && (
                  <p className={`${themeConfig.classes.text.muted} mt-2`}>{currentTrack.album}</p>
                )}
              </motion.div>

              {/* Progress Bar */}
              <motion.div 
                className="mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className={`w-full h-2 ${themeConfig.classes.card} rounded-lg appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                    [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:bg-gray-100
                    [&::-webkit-slider-thumb]:shadow-lg`}
                />
                <div className={`flex justify-between ${themeConfig.classes.text.muted} text-sm mt-2`}>
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </motion.div>

              {/* Controls */}
              <motion.div 
                className="flex items-center justify-center gap-6 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {/* Shuffle */}
                <motion.button
                  onClick={toggleShuffle}
                  className={`p-3 rounded-full ${themeConfig.classes.button.secondary} transition ${
                    shuffle ? themeConfig.classes.accent : themeConfig.classes.text.muted
                  }`}
                  title="Shuffle"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Shuffle className="w-6 h-6" />
                </motion.button>

                {/* Previous */}
                <motion.button
                  onClick={playPrevious}
                  className={`p-4 rounded-full ${themeConfig.classes.button.secondary} ${themeConfig.classes.text.primary} hover:scale-110 transition`}
                  title="Previous"
                  whileHover={{ scale: 1.15, x: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SkipBack className="w-8 h-8" />
                </motion.button>

                {/* Play/Pause */}
                <motion.button
                  onClick={togglePlayPause}
                  className={`p-6 rounded-full ${themeConfig.classes.button.primary} hover:scale-110 transition shadow-2xl`}
                  title={isPlaying ? 'Pause' : 'Play'}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <AnimatePresence mode="wait">
                    {isPlaying ? (
                      <motion.div
                        key="pause"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Pause className="w-10 h-10" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="play"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Play className="w-10 h-10 ml-1" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* Next */}
                <motion.button
                  onClick={playNext}
                  className="p-4 rounded-full hover:bg-slate-800 text-white hover:scale-110 transition"
                  title="Next"
                  disabled={queue.length === 0}
                  whileHover={{ scale: 1.15, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SkipForward className="w-8 h-8" />
                </motion.button>

                {/* Repeat */}
                <motion.button
                  onClick={toggleRepeat}
                  className={`p-3 rounded-full hover:bg-slate-800 transition ${
                    repeat !== 'off' ? 'text-green-500' : 'text-slate-400 hover:text-white'
                  }`}
                  title={`Repeat: ${repeat}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {repeat === 'one' ? (
                    <Repeat1 className="w-6 h-6" />
                  ) : (
                    <Repeat className="w-6 h-6" />
                  )}
                </motion.button>
              </motion.div>

              {/* Volume Control */}
              <motion.div 
                className="flex items-center justify-center gap-4 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <motion.button
                  onClick={toggleMute}
                  className="p-2 rounded-full hover:bg-slate-800 text-white transition"
                  title={isMuted ? 'Unmute' : 'Mute'}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </motion.button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="w-64 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                    [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:bg-gray-100"
                />
                <span className="text-slate-400 text-sm w-12 text-right">
                  {isMuted ? 0 : volume}%
                </span>
              </motion.div>

              {/* Queue Preview */}
              {queue.length > 0 && (
                <motion.div 
                  className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Music className="w-5 h-5" />
                    Up Next ({queue.length} tracks)
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {queue.slice(0, 5).map((track, index) => (
                      <motion.div
                        key={`${track.id}-${index}`}
                        onClick={() => play(track)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/50 transition cursor-pointer group"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.8 + index * 0.05 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="text-slate-500 w-6 text-sm">{index + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate group-hover:text-blue-400 transition">
                            {track.songName}
                          </p>
                          <p className="text-slate-400 text-sm truncate">
                            {track.artist || 'Unknown Artist'}
                          </p>
                        </div>
                        {track.duration && (
                          <span className="text-slate-500 text-sm">{track.duration}</span>
                        )}
                      </motion.div>
                    ))}
                    {queue.length > 5 && (
                      <motion.p 
                        className="text-slate-500 text-sm text-center pt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 1.1 }}
                      >
                        +{queue.length - 5} more tracks
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FullPlayerModal;
