import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Grid3x3, 
  List, 
  Music, 
  Filter,
  X,
  ChevronDown,
  Disc3,
  User,
  Album,
  Clock,
  FileAudio,
  Link as LinkIcon,
  Loader2,
  Play,
  Pause
} from 'lucide-react';
import { toast } from 'sonner';
import { usePlayer } from '@/context/PlayerContext';
import { LibraryGridSkeleton, TrackListSkeleton } from '@/components/SkeletonLoader';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Library = () => {
  const navigate = useNavigate();
  const { play, currentTrack, isPlaying, addToQueue } = usePlayer();
  
  // State management
  const [tracks, setTracks] = useState([]);
  const [filteredTracks, setFilteredTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [selectedArtist, setSelectedArtist] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState('');
  const [selectedType, setSelectedType] = useState(''); // 'url' or 'file'
  const [sortBy, setSortBy] = useState('recent');
  
  // Data for filter dropdowns
  const [playlists, setPlaylists] = useState([]);
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [stats, setStats] = useState(null);

  // Fetch all data
  useEffect(() => {
    fetchLibraryData();
    fetchPlaylists();
    fetchArtists();
    fetchAlbums();
    fetchStats();
  }, []);

  // Apply filters and search whenever they change
  useEffect(() => {
    fetchLibraryData();
  }, [searchQuery, selectedPlaylist, selectedArtist, selectedAlbum, selectedType, sortBy]);

  const fetchLibraryData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedPlaylist) params.append('playlist', selectedPlaylist);
      if (selectedArtist) params.append('artist', selectedArtist);
      if (selectedAlbum) params.append('album', selectedAlbum);
      if (selectedType) params.append('type', selectedType);
      if (sortBy) params.append('sortBy', sortBy);

      const response = await axios.get(`${API}/library/tracks?${params.toString()}`);
      setTracks(response.data.tracks);
      setFilteredTracks(response.data.tracks);
    } catch (error) {
      console.error('Error fetching library:', error);
      toast.error('Failed to load library');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get(`${API}/playlists`);
      setPlaylists(response.data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const fetchArtists = async () => {
    try {
      const response = await axios.get(`${API}/library/artists`);
      setArtists(response.data.artists);
    } catch (error) {
      console.error('Error fetching artists:', error);
    }
  };

  const fetchAlbums = async () => {
    try {
      const response = await axios.get(`${API}/library/albums`);
      setAlbums(response.data.albums);
    } catch (error) {
      console.error('Error fetching albums:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/library/stats`);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedPlaylist('');
    setSelectedArtist('');
    setSelectedAlbum('');
    setSelectedType('');
    setSortBy('recent');
  };

  const hasActiveFilters = selectedPlaylist || selectedArtist || selectedAlbum || selectedType || searchQuery;

  const handleTrackClick = (trackId) => {
    navigate(`/library/track/${trackId}`);
  };

  const getSortLabel = (value) => {
    const labels = {
      'recent': 'Recently Added',
      'name-asc': 'Name (A-Z)',
      'name-desc': 'Name (Z-A)',
      'duration-asc': 'Shortest First',
      'duration-desc': 'Longest First',
    };
    return labels[value] || 'Sort By';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-indigo-900/40 via-slate-900/40 to-purple-900/40 backdrop-blur-xl border-b border-indigo-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Title and Stats */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Content Library
            </h1>
            <p className="text-slate-300">Browse and discover all your music in one place</p>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl p-4 border border-indigo-800/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-600/20 rounded-lg">
                    <Music className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.totalTracks}</div>
                    <div className="text-xs text-slate-400">Total Tracks</div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl p-4 border border-purple-800/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-600/20 rounded-lg">
                    <User className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.uniqueArtists}</div>
                    <div className="text-xs text-slate-400">Artists</div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl p-4 border border-blue-800/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600/20 rounded-lg">
                    <Album className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.uniqueAlbums}</div>
                    <div className="text-xs text-slate-400">Albums</div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl p-4 border border-cyan-800/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-600/20 rounded-lg">
                    <Disc3 className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.totalPlaylists}</div>
                    <div className="text-xs text-slate-400">Playlists</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search and Controls */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tracks, artists, albums, playlists..."
                className="w-full pl-12 pr-4 py-3 bg-slate-900/60 backdrop-blur-sm border border-indigo-800/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-600/50 focus:ring-2 focus:ring-indigo-600/20"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-all ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-all ${
                  viewMode === 'list'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-xl transition-all flex items-center gap-2 ${
                showFilters || hasActiveFilters
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <Filter className="w-5 h-5" />
              <span className="hidden md:inline">Filters</span>
              {hasActiveFilters && (
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">Active</span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none px-4 py-3 pr-10 bg-slate-900/60 backdrop-blur-sm border border-indigo-800/30 rounded-xl text-white focus:outline-none focus:border-indigo-600/50 focus:ring-2 focus:ring-indigo-600/20 cursor-pointer"
              >
                <option value="recent">Recently Added</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="duration-asc">Shortest First</option>
                <option value="duration-desc">Longest First</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-slate-900/60 backdrop-blur-xl border-b border-indigo-800/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Filters</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Playlist Filter */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Playlist</label>
                <select
                  value={selectedPlaylist}
                  onChange={(e) => setSelectedPlaylist(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-600/50"
                >
                  <option value="">All Playlists</option>
                  {playlists.map((playlist) => (
                    <option key={playlist.id} value={playlist.id}>
                      {playlist.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Artist Filter */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Artist</label>
                <select
                  value={selectedArtist}
                  onChange={(e) => setSelectedArtist(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-600/50"
                >
                  <option value="">All Artists</option>
                  {artists.map((artist) => (
                    <option key={artist} value={artist}>
                      {artist}
                    </option>
                  ))}
                </select>
              </div>

              {/* Album Filter */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Album</label>
                <select
                  value={selectedAlbum}
                  onChange={(e) => setSelectedAlbum(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-600/50"
                >
                  <option value="">All Albums</option>
                  {albums.map((album) => (
                    <option key={album} value={album}>
                      {album}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Source Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-600/50"
                >
                  <option value="">All Types</option>
                  <option value="file">Uploaded Files</option>
                  <option value="url">External URLs</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-slate-400">
            {loading ? (
              'Loading...'
            ) : (
              <>
                Showing <span className="text-white font-semibold">{filteredTracks.length}</span> track
                {filteredTracks.length !== 1 ? 's' : ''}
                {hasActiveFilters && <span className="text-indigo-400"> (filtered)</span>}
              </>
            )}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredTracks.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/60 mb-4">
              <Music className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No tracks found</h3>
            <p className="text-slate-400 mb-6">
              {hasActiveFilters
                ? 'Try adjusting your filters or search query'
                : 'Start by adding tracks to your playlists'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Grid View */}
        {!loading && viewMode === 'grid' && filteredTracks.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredTracks.map((track) => (
              <div
                key={track.id}
                onClick={() => handleTrackClick(track.id)}
                className="group bg-slate-900/60 backdrop-blur-sm rounded-xl overflow-hidden border border-indigo-800/20 hover:border-indigo-600/40 transition-all cursor-pointer hover:scale-105"
              >
                {/* Cover Image */}
                <div className="relative aspect-square bg-gradient-to-br from-indigo-600/20 to-purple-600/20 overflow-hidden">
                  {track.playlistCover ? (
                    <img
                      src={`${BACKEND_URL}${track.playlistCover}`}
                      alt={track.songName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music className="w-12 h-12 text-indigo-400/50" />
                    </div>
                  )}
                  {/* Type Badge */}
                  <div className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-sm rounded-lg">
                    {track.audioFile ? (
                      <FileAudio className="w-4 h-4 text-green-400" />
                    ) : (
                      <LinkIcon className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                  
                  {/* Play Button Overlay */}
                  {(track.audioFile || track.audioUrl) && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          play(track);
                        }}
                        className={`p-4 rounded-full transition-all shadow-2xl ${
                          currentTrack?.id === track.id && isPlaying
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-white hover:bg-gray-100'
                        }`}
                      >
                        {currentTrack?.id === track.id && isPlaying ? (
                          <Pause className="w-6 h-6 text-black" />
                        ) : (
                          <Play className="w-6 h-6 text-black ml-0.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Track Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-1 truncate group-hover:text-indigo-400 transition-colors">
                    {track.songName}
                  </h3>
                  <p className="text-sm text-slate-400 truncate mb-2">
                    {track.artist || 'Unknown Artist'}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Disc3 className="w-3 h-3" />
                    <span className="truncate">{track.playlistName}</span>
                  </div>
                  {track.duration && (
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{track.duration}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {!loading && viewMode === 'list' && filteredTracks.length > 0 && (
          <div className="space-y-2">
            {filteredTracks.map((track, index) => (
              <div
                key={track.id}
                onClick={() => handleTrackClick(track.id)}
                className="group flex items-center gap-4 p-4 bg-slate-900/60 backdrop-blur-sm rounded-xl border border-indigo-800/20 hover:border-indigo-600/40 hover:bg-slate-800/60 transition-all cursor-pointer"
              >
                {/* Index */}
                <div className="w-8 text-center text-slate-500 font-medium">
                  {index + 1}
                </div>

                {/* Cover Image */}
                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gradient-to-br from-indigo-600/20 to-purple-600/20 flex-shrink-0">
                  {track.playlistCover ? (
                    <img
                      src={`${BACKEND_URL}${track.playlistCover}`}
                      alt={track.songName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music className="w-6 h-6 text-indigo-400/50" />
                    </div>
                  )}
                </div>

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate group-hover:text-indigo-400 transition-colors">
                    {track.songName}
                  </h3>
                  <p className="text-sm text-slate-400 truncate">
                    {track.artist || 'Unknown Artist'}
                    {track.album && ` • ${track.album}`}
                  </p>
                </div>

                {/* Playlist Badge */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-800/60 rounded-lg">
                  <Disc3 className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm text-slate-300">{track.playlistName}</span>
                </div>

                {/* Type Badge */}
                <div className="flex items-center gap-2">
                  {track.audioFile ? (
                    <div className="flex items-center gap-1 text-xs text-green-400">
                      <FileAudio className="w-4 h-4" />
                      <span className="hidden sm:inline">File</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-blue-400">
                      <LinkIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">URL</span>
                    </div>
                  )}
                </div>

                {/* Duration */}
                {track.duration && (
                  <div className="flex items-center gap-1 text-sm text-slate-400 w-16 justify-end">
                    <Clock className="w-4 h-4" />
                    <span>{track.duration}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
