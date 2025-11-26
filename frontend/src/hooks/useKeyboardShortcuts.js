import { useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { toast } from 'sonner';

/**
 * Global keyboard shortcuts for music player
 * Space - Play/Pause
 * Arrow Right - Next track
 * Arrow Left - Previous track
 * Arrow Up - Volume up
 * Arrow Down - Volume down
 * M - Mute/Unmute
 * S - Toggle Shuffle
 * R - Toggle Repeat
 * L - Show Queue
 */
export const useKeyboardShortcuts = () => {
  const {
    isPlaying,
    togglePlayPause,
    playNext,
    playPrevious,
    volume,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    currentTrack,
  } = usePlayer();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in an input/textarea
      if (
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.isContentEditable
      ) {
        return;
      }

      // Prevent default for our shortcuts
      const shortcutKeys = [' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
      if (shortcutKeys.includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case ' ': // Spacebar
          if (currentTrack) {
            togglePlayPause();
          }
          break;

        case 'ArrowRight': // Next track
          if (currentTrack) {
            playNext();
            toast.success('⏭️ Next track');
          }
          break;

        case 'ArrowLeft': // Previous track
          if (currentTrack) {
            playPrevious();
            toast.success('⏮️ Previous track');
          }
          break;

        case 'ArrowUp': // Volume up
          if (currentTrack) {
            const newVolume = Math.min(100, volume + 5);
            setVolume(newVolume);
            toast.success(`🔊 Volume: ${newVolume}%`);
          }
          break;

        case 'ArrowDown': // Volume down
          if (currentTrack) {
            const newVolume = Math.max(0, volume - 5);
            setVolume(newVolume);
            toast.success(`🔉 Volume: ${newVolume}%`);
          }
          break;

        case 'm':
        case 'M': // Mute/Unmute
          if (currentTrack) {
            toggleMute();
          }
          break;

        case 's':
        case 'S': // Shuffle
          if (currentTrack) {
            toggleShuffle();
          }
          break;

        case 'r':
        case 'R': // Repeat
          if (currentTrack) {
            toggleRepeat();
          }
          break;

        case '?': // Show keyboard shortcuts help
          toast.info(
            `⌨️ Keyboard Shortcuts:
            Space: Play/Pause
            ← →: Previous/Next
            ↑ ↓: Volume Up/Down
            M: Mute
            S: Shuffle
            R: Repeat`,
            { duration: 5000 }
          );
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    isPlaying,
    togglePlayPause,
    playNext,
    playPrevious,
    volume,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    currentTrack,
  ]);
};
