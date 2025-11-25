// Mock data for user features (authentication UI preview)
// This data will be replaced with real API data when authentication is implemented

export const mockUser = {
  id: 'user-1',
  name: 'Sarah Mitchell',
  email: 'sarah.mitchell@example.com',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  bio: 'Music enthusiast | Playlist curator | Love discovering new artists',
  joinedDate: '2024-01-15',
  stats: {
    totalPlaylists: 12,
    totalTracks: 156,
    listeningMinutes: 4320,
    favoriteGenres: ['Electronic', 'Indie', 'Jazz']
  }
};

export const mockListenHistory = [
  {
    id: 'history-1',
    trackId: 'track-1',
    trackName: 'Midnight Dreams',
    artist: 'Luna Park',
    album: 'Night Sessions',
    playlistName: 'Chill Vibes',
    playlistId: 'playlist-1',
    playedAt: '2025-01-20T14:30:00Z',
    playCount: 12,
    duration: '3:45'
  },
  {
    id: 'history-2',
    trackId: 'track-2',
    trackName: 'Electric Soul',
    artist: 'The Synthesizers',
    album: 'Digital Hearts',
    playlistName: 'Electronic Mix',
    playlistId: 'playlist-2',
    playedAt: '2025-01-20T13:15:00Z',
    playCount: 8,
    duration: '4:12'
  },
  {
    id: 'history-3',
    trackId: 'track-3',
    trackName: 'Ocean Breeze',
    artist: 'Coastal Waves',
    album: 'Seaside Stories',
    playlistName: 'Morning Coffee',
    playlistId: 'playlist-3',
    playedAt: '2025-01-20T09:45:00Z',
    playCount: 15,
    duration: '3:28'
  },
  {
    id: 'history-4',
    trackId: 'track-4',
    trackName: 'Urban Nights',
    artist: 'City Lights',
    album: 'Metropolitan',
    playlistName: 'Focus & Flow',
    playlistId: 'playlist-4',
    playedAt: '2025-01-19T22:30:00Z',
    playCount: 5,
    duration: '4:35'
  },
  {
    id: 'history-5',
    trackId: 'track-5',
    trackName: 'Sunrise Symphony',
    artist: 'Morning Orchestra',
    album: 'Dawn Collection',
    playlistName: 'Workout Mix',
    playlistId: 'playlist-5',
    playedAt: '2025-01-19T18:20:00Z',
    playCount: 20,
    duration: '3:52'
  },
  {
    id: 'history-6',
    trackId: 'track-6',
    trackName: 'Jazz Café',
    artist: 'The Smooth Trio',
    album: 'Late Night Jazz',
    playlistName: 'Dinner Party',
    playlistId: 'playlist-6',
    playedAt: '2025-01-19T15:10:00Z',
    playCount: 7,
    duration: '5:15'
  },
  {
    id: 'history-7',
    trackId: 'track-7',
    trackName: 'Mountain High',
    artist: 'Altitude',
    album: 'Peak Experience',
    playlistName: 'Adventure Time',
    playlistId: 'playlist-7',
    playedAt: '2025-01-19T12:00:00Z',
    playCount: 3,
    duration: '4:08'
  },
  {
    id: 'history-8',
    trackId: 'track-8',
    trackName: 'Digital Dreams',
    artist: 'Cyber Sound',
    album: 'Future Beats',
    playlistName: 'Gaming Sessions',
    playlistId: 'playlist-8',
    playedAt: '2025-01-18T20:45:00Z',
    playCount: 18,
    duration: '3:33'
  },
  {
    id: 'history-9',
    trackId: 'track-9',
    trackName: 'Acoustic Sunset',
    artist: 'String Theory',
    album: 'Unplugged',
    playlistName: 'Acoustic Favorites',
    playlistId: 'playlist-9',
    playedAt: '2025-01-18T17:30:00Z',
    playCount: 11,
    duration: '3:58'
  },
  {
    id: 'history-10',
    trackId: 'track-10',
    trackName: 'Rhythm & Blues',
    artist: 'Soul Masters',
    album: 'Classic Groove',
    playlistName: 'R&B Classics',
    playlistId: 'playlist-10',
    playedAt: '2025-01-18T14:15:00Z',
    playCount: 9,
    duration: '4:22'
  },
  {
    id: 'history-11',
    trackId: 'track-11',
    trackName: 'Neon Lights',
    artist: 'Retro Wave',
    album: '80s Revival',
    playlistName: 'Retro Hits',
    playlistId: 'playlist-11',
    playedAt: '2025-01-17T21:00:00Z',
    playCount: 14,
    duration: '3:41'
  },
  {
    id: 'history-12',
    trackId: 'track-12',
    trackName: 'Forest Path',
    artist: 'Nature Sounds',
    album: 'Wilderness',
    playlistName: 'Nature Meditation',
    playlistId: 'playlist-12',
    playedAt: '2025-01-17T10:30:00Z',
    playCount: 6,
    duration: '6:12'
  },
  {
    id: 'history-13',
    trackId: 'track-13',
    trackName: 'Cosmic Journey',
    artist: 'Space Explorers',
    album: 'Interstellar',
    playlistName: 'Space Vibes',
    playlistId: 'playlist-13',
    playedAt: '2025-01-16T19:45:00Z',
    playCount: 4,
    duration: '5:28'
  },
  {
    id: 'history-14',
    trackId: 'track-14',
    trackName: 'Piano Reflections',
    artist: 'Ivory Keys',
    album: 'Solo Piano',
    playlistName: 'Study Music',
    playlistId: 'playlist-14',
    playedAt: '2025-01-16T16:20:00Z',
    playCount: 22,
    duration: '4:05'
  },
  {
    id: 'history-15',
    trackId: 'track-15',
    trackName: 'Thunder Storm',
    artist: 'Electric Pulse',
    album: 'Energy',
    playlistName: 'Intense Workout',
    playlistId: 'playlist-15',
    playedAt: '2025-01-15T08:00:00Z',
    playCount: 10,
    duration: '3:19'
  }
];

export const mockFavoritePlaylists = [
  {
    id: 'fav-playlist-1',
    name: 'Chill Vibes',
    description: 'Perfect for relaxing evenings',
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=800&fit=crop',
    trackCount: 24,
    totalDuration: '1h 45m',
    addedAt: '2025-01-10'
  },
  {
    id: 'fav-playlist-2',
    name: 'Morning Coffee',
    description: 'Start your day right',
    coverImage: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=800&fit=crop',
    trackCount: 18,
    totalDuration: '1h 12m',
    addedAt: '2025-01-12'
  },
  {
    id: 'fav-playlist-3',
    name: 'Workout Mix',
    description: 'High energy tracks for your workout',
    coverImage: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=800&fit=crop',
    trackCount: 32,
    totalDuration: '2h 15m',
    addedAt: '2025-01-08'
  },
  {
    id: 'fav-playlist-4',
    name: 'Focus & Flow',
    description: 'Deep focus and productivity',
    coverImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=800&fit=crop',
    trackCount: 28,
    totalDuration: '2h 05m',
    addedAt: '2025-01-15'
  },
  {
    id: 'fav-playlist-5',
    name: 'Evening Jazz',
    description: 'Smooth jazz for dinner time',
    coverImage: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&h=800&fit=crop',
    trackCount: 21,
    totalDuration: '1h 52m',
    addedAt: '2025-01-05'
  },
  {
    id: 'fav-playlist-6',
    name: 'Road Trip Essentials',
    description: 'Best songs for long drives',
    coverImage: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&h=800&fit=crop',
    trackCount: 45,
    totalDuration: '3h 20m',
    addedAt: '2025-01-18'
  }
];

export const mockFavoriteTracks = [
  {
    id: 'fav-track-1',
    trackName: 'Midnight Dreams',
    artist: 'Luna Park',
    album: 'Night Sessions',
    duration: '3:45',
    addedAt: '2025-01-18',
    playCount: 12
  },
  {
    id: 'fav-track-2',
    trackName: 'Electric Soul',
    artist: 'The Synthesizers',
    album: 'Digital Hearts',
    duration: '4:12',
    addedAt: '2025-01-17',
    playCount: 8
  },
  {
    id: 'fav-track-3',
    trackName: 'Ocean Breeze',
    artist: 'Coastal Waves',
    album: 'Seaside Stories',
    duration: '3:28',
    addedAt: '2025-01-16',
    playCount: 15
  },
  {
    id: 'fav-track-4',
    trackName: 'Piano Reflections',
    artist: 'Ivory Keys',
    album: 'Solo Piano',
    duration: '4:05',
    addedAt: '2025-01-15',
    playCount: 22
  },
  {
    id: 'fav-track-5',
    trackName: 'Sunrise Symphony',
    artist: 'Morning Orchestra',
    album: 'Dawn Collection',
    duration: '3:52',
    addedAt: '2025-01-14',
    playCount: 20
  },
  {
    id: 'fav-track-6',
    trackName: 'Jazz Café',
    artist: 'The Smooth Trio',
    album: 'Late Night Jazz',
    duration: '5:15',
    addedAt: '2025-01-13',
    playCount: 7
  },
  {
    id: 'fav-track-7',
    trackName: 'Digital Dreams',
    artist: 'Cyber Sound',
    album: 'Future Beats',
    duration: '3:33',
    addedAt: '2025-01-12',
    playCount: 18
  },
  {
    id: 'fav-track-8',
    trackName: 'Neon Lights',
    artist: 'Retro Wave',
    album: '80s Revival',
    duration: '3:41',
    addedAt: '2025-01-10',
    playCount: 14
  },
  {
    id: 'fav-track-9',
    trackName: 'Acoustic Sunset',
    artist: 'String Theory',
    album: 'Unplugged',
    duration: '3:58',
    addedAt: '2025-01-08',
    playCount: 11
  },
  {
    id: 'fav-track-10',
    trackName: 'Rhythm & Blues',
    artist: 'Soul Masters',
    album: 'Classic Groove',
    duration: '4:22',
    addedAt: '2025-01-05',
    playCount: 9
  }
];

export const mockRecentlyPlayed = mockListenHistory.slice(0, 10);
