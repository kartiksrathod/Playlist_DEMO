import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

const PlayerContext = createContext();

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
};

export const PlayerProvider = ({ children }) => {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

  // Player state
  const [currentTrack, setCurrentTrack] = useState(null);
  const [queue, setQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState('off'); // 'off', 'one', 'all'
  const [autoPlay, setAutoPlay] = useState(true);

  const audioRef = useRef(null);
  const previousVolumeRef = useRef(70);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume / 100;

    // Load settings from backend
    fetchSettings();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Fetch user settings from backend
  const fetchSettings = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/settings`);
      if (response.ok) {
        const data = await response.json();
        setVolumeState(data.volume || 70);
        setAutoPlay(data.autoPlay !== undefined ? data.autoPlay : true);
        setShuffle(data.shuffle || false);
        setRepeat(data.repeat || 'off');
        
        if (audioRef.current) {
          audioRef.current.volume = (data.volume || 70) / 100;
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  // Update settings in backend
  const updateSettings = async (updates) => {
    try {
      await fetch(`${BACKEND_URL}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  // Record play in history
  const recordPlay = async (trackId, playlistId, duration, completed) => {
    try {
      await fetch(`${BACKEND_URL}/api/history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackId, playlistId, duration, completed }),
      });
    } catch (error) {
      console.error('Error recording play:', error);
    }
  };

  // Get audio URL
  const getAudioUrl = (track) => {
    if (track.audioFile) {
      return `${BACKEND_URL}${track.audioFile}`;
    }
    return track.audioUrl || null;
  };

  // Setup audio event listeners
  const setupAudioListeners = useCallback(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.onloadedmetadata = () => {
      setDuration(audio.duration);
    };

    audio.onended = () => {
      handleTrackEnd();
    };

    audio.onerror = (e) => {
      console.error('Audio error:', e);
      toast.error('Failed to play audio');
      setIsPlaying(false);
    };
  }, []);

  // Handle track end
  const handleTrackEnd = () => {
    if (currentTrack) {
      // Record completed play
      recordPlay(currentTrack.id, currentTrack.playlistId, duration, true);
    }

    if (repeat === 'one') {
      // Replay same track
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else if (autoPlay) {
      // Play next track
      playNext();
    } else {
      setIsPlaying(false);
    }
  };

  // Play track
  const play = async (track, playlist = null) => {
    if (!track) return;

    const audioUrl = getAudioUrl(track);
    if (!audioUrl) {
      toast.error('No audio available for this track');
      return;
    }

    try {
      // If same track, just toggle play/pause
      if (currentTrack?.id === track.id && audioRef.current) {
        if (audioRef.current.paused) {
          await audioRef.current.play();
          setIsPlaying(true);
        } else {
          audioRef.current.pause();
          setIsPlaying(false);
        }
        return;
      }

      // Stop current audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      // Set new track
      setCurrentTrack({ ...track, playlistId: playlist?.id || track.playlistId || null });
      
      // Load and play new audio
      audioRef.current.src = audioUrl;
      audioRef.current.volume = isMuted ? 0 : volume / 100;
      setupAudioListeners();
      
      await audioRef.current.play();
      setIsPlaying(true);

      // Record play start
      recordPlay(track.id, playlist?.id || track.playlistId || null, 0, false);
    } catch (error) {
      console.error('Error playing track:', error);
      toast.error('Failed to play track');
      setIsPlaying(false);
    }
  };

  // Pause
  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (isPlaying) {
      pause();
    } else if (currentTrack) {
      play(currentTrack);
    }
  };

  // Play next track
  const playNext = () => {
    if (queue.length === 0) {
      setIsPlaying(false);
      return;
    }

    const currentIndex = queue.findIndex((t) => t.id === currentTrack?.id);
    
    if (currentIndex === -1) {
      // Current track not in queue, play first track
      play(queue[0]);
    } else {
      // Play next track in queue
      const nextIndex = currentIndex + 1;
      
      if (nextIndex < queue.length) {
        play(queue[nextIndex]);
      } else if (repeat === 'all') {
        // Loop back to start
        play(queue[0]);
      } else {
        // End of queue
        setIsPlaying(false);
      }
    }
  };

  // Play previous track
  const playPrevious = () => {
    if (queue.length === 0) return;

    // If current time > 3 seconds, restart current track
    if (currentTime > 3) {
      seek(0);
      return;
    }

    const currentIndex = queue.findIndex((t) => t.id === currentTrack?.id);
    
    if (currentIndex === -1 || currentIndex === 0) {
      // Play first track
      play(queue[0]);
    } else {
      // Play previous track
      play(queue[currentIndex - 1]);
    }
  };

  // Seek to position
  const seek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Set volume
  const setVolume = (vol) => {
    const newVolume = Math.max(0, Math.min(100, vol));
    setVolumeState(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }

    if (isMuted && newVolume > 0) {
      setIsMuted(false);
    }

    // Update in backend
    updateSettings({ volume: newVolume });
  };

  // Toggle mute
  const toggleMute = () => {
    if (isMuted) {
      // Unmute
      setIsMuted(false);
      if (audioRef.current) {
        audioRef.current.volume = volume / 100;
      }
    } else {
      // Mute
      setIsMuted(true);
      if (audioRef.current) {
        previousVolumeRef.current = volume;
        audioRef.current.volume = 0;
      }
    }
  };

  // Toggle shuffle
  const toggleShuffle = () => {
    const newShuffle = !shuffle;
    setShuffle(newShuffle);
    
    if (newShuffle && queue.length > 1) {
      // Shuffle queue (keep current track at current position)
      const currentIndex = queue.findIndex((t) => t.id === currentTrack?.id);
      const shuffled = [...queue];
      
      // Fisher-Yates shuffle
      for (let i = shuffled.length - 1; i > 0; i--) {
        if (i !== currentIndex) {
          const j = Math.floor(Math.random() * (i + 1));
          if (j !== currentIndex) {
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }
        }
      }
      
      setQueue(shuffled);
      toast.success('Shuffle enabled');
    } else {
      toast.success('Shuffle disabled');
    }

    updateSettings({ shuffle: newShuffle });
  };

  // Toggle repeat
  const toggleRepeat = () => {
    const modes = ['off', 'one', 'all'];
    const currentIndex = modes.indexOf(repeat);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    
    setRepeat(nextMode);
    
    const messages = {
      off: 'Repeat off',
      one: 'Repeat one',
      all: 'Repeat all',
    };
    
    toast.success(messages[nextMode]);
    updateSettings({ repeat: nextMode });
  };

  // Add track to queue
  const addToQueue = (track) => {
    setQueue((prev) => [...prev, track]);
    toast.success(`Added to queue: ${track.songName}`);
  };

  // Add multiple tracks to queue
  const addMultipleToQueue = (tracks) => {
    setQueue((prev) => [...prev, ...tracks]);
    toast.success(`Added ${tracks.length} tracks to queue`);
  };

  // Play now (clear queue and play)
  const playNow = (track, playlist = null) => {
    setQueue([track]);
    play(track, playlist);
  };

  // Play all (set as queue and play first)
  const playAll = (tracks, startIndex = 0, playlist = null) => {
    if (tracks.length === 0) return;
    
    setQueue(tracks);
    play(tracks[startIndex], playlist);
    toast.success(`Playing ${tracks.length} tracks`);
  };

  // Remove from queue
  const removeFromQueue = (trackId) => {
    setQueue((prev) => prev.filter((t) => t.id !== trackId));
  };

  // Clear queue
  const clearQueue = () => {
    setQueue([]);
    toast.success('Queue cleared');
  };

  // Reorder queue
  const reorderQueue = (startIndex, endIndex) => {
    const result = Array.from(queue);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setQueue(result);
  };

  const value = {
    // State
    currentTrack,
    queue,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    shuffle,
    repeat,
    autoPlay,
    
    // Actions
    play,
    pause,
    togglePlayPause,
    playNext,
    playPrevious,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    addToQueue,
    addMultipleToQueue,
    playNow,
    playAll,
    removeFromQueue,
    clearQueue,
    reorderQueue,
    setAutoPlay: (value) => {
      setAutoPlay(value);
      updateSettings({ autoPlay: value });
    },
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};
