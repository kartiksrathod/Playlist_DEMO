import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Repeat1,
  List,
  Maximize2,
} from 'lucide-react';
import QueueDrawer from './QueueDrawer';
import FullPlayerModal from './FullPlayerModal';
import { motion, AnimatePresence } from 'framer-motion';

const MusicPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    shuffle,
    repeat,
    togglePlayPause,
    playNext,
    playPrevious,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    queue,
  } = usePlayer();

  const [showQueue, setShowQueue] = useState(false);
  const [showFullPlayer, setShowFullPlayer] = useState(false);

  // Don't show player if no track
  if (!currentTrack) return null;

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
    return 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400';
  };

  // Handle progress bar click
  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    seek(newTime);
  };

  return (
    <>
      {/* Persistent Bottom Player */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50">
        {/* Mini Progress Bar */}
        <div
          className="h-1 bg-slate-700 cursor-pointer hover:h-1.5 transition-all"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>

        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Track Info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <img
                src={getCoverImage()}
                alt={currentTrack.songName}
                className="w-14 h-14 rounded-lg object-cover shadow-lg"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-white font-medium truncate">{currentTrack.songName}</h4>
                <p className="text-slate-400 text-sm truncate">
                  {currentTrack.artist || 'Unknown Artist'}
                </p>
              </div>
            </div>

            {/* Center: Player Controls */}
            <div className="flex items-center gap-2">
              {/* Shuffle */}
              <button
                onClick={toggleShuffle}
                className={`p-2 rounded-full hover:bg-slate-800 transition ${
                  shuffle ? 'text-green-500' : 'text-slate-400'
                }`}
                title="Shuffle"
              >
                <Shuffle className="w-4 h-4" />
              </button>

              {/* Previous */}
              <button
                onClick={playPrevious}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition"
                title="Previous"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              {/* Play/Pause */}
              <button
                onClick={togglePlayPause}
                className="p-3 rounded-full bg-white hover:bg-gray-100 text-slate-900 transition shadow-lg"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>

              {/* Next */}
              <button
                onClick={playNext}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition"
                title="Next"
                disabled={queue.length === 0}
              >
                <SkipForward className="w-5 h-5" />
              </button>

              {/* Repeat */}
              <button
                onClick={toggleRepeat}
                className={`p-2 rounded-full hover:bg-slate-800 transition ${
                  repeat !== 'off' ? 'text-green-500' : 'text-slate-400'
                }`}
                title={`Repeat: ${repeat}`}
              >
                {repeat === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
              </button>
            </div>

            {/* Right: Additional Controls */}
            <div className="flex items-center gap-2 flex-1 justify-end">
              {/* Time */}
              <div className="text-slate-400 text-sm hidden sm:block">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>

              {/* Volume */}
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                    [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:bg-gray-100"
                />
              </div>

              {/* Queue */}
              <button
                onClick={() => setShowQueue(true)}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition relative"
                title="Queue"
              >
                <List className="w-5 h-5" />
                {queue.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {queue.length}
                  </span>
                )}
              </button>

              {/* Expand */}
              <button
                onClick={() => setShowFullPlayer(true)}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition"
                title="Expand Player"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Queue Drawer */}
      <QueueDrawer isOpen={showQueue} onClose={() => setShowQueue(false)} />

      {/* Full Player Modal */}
      <FullPlayerModal isOpen={showFullPlayer} onClose={() => setShowFullPlayer(false)} />
    </>
  );
};

export default MusicPlayer;
