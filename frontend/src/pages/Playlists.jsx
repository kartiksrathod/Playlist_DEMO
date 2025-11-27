import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Music, Pencil, Trash2, Heart, Play, Keyboard, Share2, Globe } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import SearchBar from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import CreatePlaylistDialog from '@/components/CreatePlaylistDialog';
import EditPlaylistDialog from '@/components/EditPlaylistDialog';
import SharePlaylistDialog from '@/components/SharePlaylistDialog';
import { toast } from 'sonner';
import { PlaylistGridSkeleton } from '@/components/SkeletonLoader';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Default warm nature images for playlists
const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1699116548118-1605ae766335?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjBsYWtlfGVufDB8fHxvcmFuZ2V8MTc2NDA5NjczOXww&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1583883175425-46dee3845e7f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwzfHxnb2xkZW4lMjBob3VyJTIwbmF0dXJlfGVufDB8fHxvcmFuZ2V8MTc2NDA5Njc1MHww&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1656648497153-a826258d2886?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxnb2xkZW4lMjBob3VyJTIwbmF0dXJlfGVufDB8fHxvcmFuZ2V8MTc2NDA5Njc1MHww&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1712353704504-1db1f9e093db?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwyfHx3YXJtJTIwc3VucmlzZXxlbnwwfHx8b3JhbmdlfDE3NjQwOTY3MzN8MA&ixlib=rb-4.1.0&q=85',
];

const Playlists = () => {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [favoritedPlaylists, setFavoritedPlaylists] = useState(new Set());

  // Fetch all playlists
  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/playlists`);
      setPlaylists(response.data);
      setFilteredPlaylists(response.data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      toast.error('Failed to load playlists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
    fetchFavorites();
  }, []);

  // Fetch favorites
  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`${API}/favorites/all`);
      setFavoritedPlaylists(new Set(response.data.favorites.playlists || []));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  // Toggle favorite
  const toggleFavorite = async (playlistId, e) => {
    e.stopPropagation();
    
    try {
      const isFavorited = favoritedPlaylists.has(playlistId);
      
      if (isFavorited) {
        await axios.delete(`${API}/favorites/playlists/${playlistId}`);
        setFavoritedPlaylists(prev => {
          const newSet = new Set(prev);
          newSet.delete(playlistId);
          return newSet;
        });
        toast.success('Removed from favorites');
      } else {
        await axios.post(`${API}/favorites/playlists/${playlistId}`);
        setFavoritedPlaylists(prev => new Set([...prev, playlistId]));
        toast.success('Added to favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
  };

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPlaylists(playlists);
    } else {
      const filtered = playlists.filter(playlist =>
        playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (playlist.description && playlist.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredPlaylists(filtered);
    }
  }, [searchQuery, playlists]);

  // Handle delete
  const handleDelete = async () => {
    if (!selectedPlaylist) return;

    try {
      await axios.delete(`${API}/playlists/${selectedPlaylist.id}`);
      toast.success('Playlist deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedPlaylist(null);
      fetchPlaylists();
    } catch (error) {
      console.error('Error deleting playlist:', error);
      toast.error('Failed to delete playlist');
    }
  };

  // Get image URL
  const getImageUrl = (coverImage, index) => {
    if (coverImage) {
      return `${BACKEND_URL}${coverImage}`;
    }
    // Use default warm nature images cycling through the array
    return DEFAULT_IMAGES[index % DEFAULT_IMAGES.length];
  };

  return (
    <AppLayout>
      <div className="min-h-screen px-8 py-8 bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950">
        {/* Header with Search */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-200 via-white to-blue-200 bg-clip-text text-transparent mb-2 drop-shadow-lg">Playlists</h1>
              <p className="text-blue-100 font-light">Your music collection</p>
            </motion.div>
            <motion.div 
              className="flex gap-3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={() => navigate('/public-playlists')}
                  variant="outline"
                  className="px-6 py-6 bg-green-700/30 hover:bg-green-600/40 text-white rounded-xl shadow-xl hover:shadow-green-600/40 transition-all backdrop-blur-xl border border-green-500/30"
                >
                  <Globe className="mr-2 h-5 w-5" />
                  Browse Public
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={() => setCreateDialogOpen(true)}
                  className="px-6 py-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl shadow-2xl hover:shadow-blue-600/60 transition-all backdrop-blur-xl border border-blue-500/30"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Create Playlist
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Search Bar */}
          <SearchBar 
            placeholder="Search playlists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </motion.div>

        {/* View Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-900/40 border border-blue-700/40 rounded-lg text-sm text-blue-100 hover:bg-blue-900/60 transition-colors backdrop-blur-xl shadow-lg">
              Grid
            </button>
            <button className="px-4 py-2 text-blue-200 text-sm hover:bg-blue-900/40 rounded-lg transition-colors backdrop-blur-sm">
              List
            </button>
          </div>
          <p className="text-sm text-blue-200">
            {filteredPlaylists.length} {filteredPlaylists.length === 1 ? 'playlist' : 'playlists'}
          </p>
        </div>

        {/* Loading State */}
        {loading && <PlaylistGridSkeleton count={8} />}

        {/* Empty State */}
        {!loading && filteredPlaylists.length === 0 && playlists.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mb-6 shadow-2xl shadow-blue-700/60">
              <Music className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-light text-white mb-2">No playlists yet</h2>
            <p className="text-blue-50 mb-6 font-light">Create your first playlist to get started</p>
            <Button 
              onClick={() => setCreateDialogOpen(true)}
              className="px-6 py-3 bg-blue-700 hover:bg-blue-600 text-white rounded-xl shadow-2xl shadow-blue-700/50 backdrop-blur-xl border border-blue-500/30"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Your First Playlist
            </Button>
          </div>
        )}

        {/* No Search Results */}
        {!loading && filteredPlaylists.length === 0 && playlists.length > 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Music className="h-16 w-16 text-blue-400 mb-4" />
            <h2 className="text-xl font-light text-blue-100 mb-2">No playlists found</h2>
            <p className="text-blue-200 font-light">Try a different search term</p>
          </div>
        )}

        {/* Playlists Grid */}
        {!loading && filteredPlaylists.length > 0 && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence mode="popLayout">
              {filteredPlaylists.map((playlist, index) => (
                <motion.div 
                  key={playlist.id} 
                  layout
                  className="group relative bg-slate-900/60 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border border-blue-700/30"
                  onClick={() => navigate(`/playlists/${playlist.id}`)}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 200,
                    damping: 20
                  }}
                  whileHover={{ 
                    y: -8, 
                    scale: 1.02,
                    boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)",
                    transition: { duration: 0.2 } 
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                {/* Cover Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={getImageUrl(playlist.coverImage, index)} 
                    alt={playlist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950/70 via-blue-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Hover Actions */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/playlists/${playlist.id}`);
                      }}
                      className="p-3 bg-blue-700 hover:bg-blue-600 rounded-full transition-colors shadow-xl backdrop-blur-sm border border-blue-500/30"
                    >
                      <Play className="h-5 w-5 text-white" />
                    </button>
                    <button
                      onClick={(e) => toggleFavorite(playlist.id, e)}
                      className={`p-3 ${favoritedPlaylists.has(playlist.id) ? 'bg-pink-700 hover:bg-pink-600' : 'bg-slate-800 hover:bg-slate-700'} rounded-full transition-colors shadow-xl backdrop-blur-sm border ${favoritedPlaylists.has(playlist.id) ? 'border-pink-500/30' : 'border-slate-600/30'}`}
                    >
                      <Heart className={`h-5 w-5 text-white ${favoritedPlaylists.has(playlist.id) ? 'fill-white' : ''}`} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlaylist(playlist);
                        setShareDialogOpen(true);
                      }}
                      className="p-3 bg-green-700 hover:bg-green-600 rounded-full transition-colors shadow-xl backdrop-blur-sm border border-green-500/30"
                    >
                      <Share2 className="h-5 w-5 text-white" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlaylist(playlist);
                        setEditDialogOpen(true);
                      }}
                      className="p-3 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors shadow-xl backdrop-blur-sm border border-slate-600/30"
                    >
                      <Pencil className="h-5 w-5 text-white" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlaylist(playlist);
                        setDeleteDialogOpen(true);
                      }}
                      className="p-3 bg-red-700 hover:bg-red-600 rounded-full transition-colors shadow-xl backdrop-blur-sm border border-red-500/30"
                    >
                      <Trash2 className="h-5 w-5 text-white" />
                    </button>
                  </div>

                  {/* Stats Badge */}
                  <div className="absolute bottom-3 right-3 px-3 py-1 bg-blue-700/90 backdrop-blur-md rounded-full text-xs font-medium text-white shadow-lg">
                    Music
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <h3 className="font-medium text-white mb-1 truncate drop-shadow-sm">{playlist.name}</h3>
                  <p className="text-sm text-blue-100 line-clamp-2 min-h-[2.5rem] font-light">
                    {playlist.description || 'A collection of beautiful tracks'}
                  </p>
                  
                  {/* Favorite Indicator */}
                  {favoritedPlaylists.has(playlist.id) && (
                    <div className="flex items-center gap-4 mt-3 text-xs text-pink-300">
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3 fill-pink-300" />
                        <span>Favorited</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

        {/* Create Playlist Dialog */}
        <CreatePlaylistDialog 
          open={createDialogOpen} 
          onOpenChange={setCreateDialogOpen}
          onSuccess={fetchPlaylists}
        />

        {/* Edit Playlist Dialog */}
        {selectedPlaylist && (
          <EditPlaylistDialog 
            open={editDialogOpen} 
            onOpenChange={setEditDialogOpen}
            playlist={selectedPlaylist}
            onSuccess={fetchPlaylists}
          />
        )}

        {/* Share Playlist Dialog */}
        {selectedPlaylist && (
          <SharePlaylistDialog 
            open={shareDialogOpen} 
            onOpenChange={setShareDialogOpen}
            playlist={selectedPlaylist}
            onUpdate={fetchPlaylists}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="bg-white rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Playlist?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete "{selectedPlaylist?.name}" and all its tracks. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSelectedPlaylist(null)} className="rounded-xl">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete} 
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
};

export default Playlists;
