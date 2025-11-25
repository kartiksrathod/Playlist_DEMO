import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Music, Pencil, Trash2, Heart, Play } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import SearchBar from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import CreatePlaylistDialog from '@/components/CreatePlaylistDialog';
import EditPlaylistDialog from '@/components/EditPlaylistDialog';
import { toast } from 'sonner';

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
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

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
  }, []);

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
      <div className="min-h-screen px-8 py-8 bg-slate-950">
        {/* Header with Search */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-light text-white mb-2">Playlists</h1>
              <p className="text-blue-200 font-light">Your music collection</p>
            </div>
            <Button 
              onClick={() => setCreateDialogOpen(true)}
              className="px-6 py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg hover:shadow-blue-500/50 transition-all"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Playlist
            </Button>
          </div>

          {/* Search Bar */}
          <SearchBar 
            placeholder="Search playlists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* View Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-900/30 border border-blue-500/30 rounded-lg text-sm text-blue-200 hover:bg-blue-900/50 transition-colors backdrop-blur-sm">
              Grid
            </button>
            <button className="px-4 py-2 text-blue-300 text-sm hover:bg-blue-900/30 rounded-lg transition-colors">
              List
            </button>
          </div>
          <p className="text-sm text-blue-300">
            {filteredPlaylists.length} {filteredPlaylists.length === 1 ? 'playlist' : 'playlists'}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-slate-800/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm animate-pulse border border-blue-500/20">
                <div className="h-48 bg-blue-900/30" />
                <div className="p-4">
                  <div className="h-4 bg-blue-900/30 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-blue-900/30 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredPlaylists.length === 0 && playlists.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/50">
              <Music className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-light text-white mb-2">No playlists yet</h2>
            <p className="text-blue-200 mb-6 font-light">Create your first playlist to get started</p>
            <Button 
              onClick={() => setCreateDialogOpen(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Your First Playlist
            </Button>
          </div>
        )}

        {/* No Search Results */}
        {!loading && filteredPlaylists.length === 0 && playlists.length > 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Music className="h-16 w-16 text-blue-700 mb-4" />
            <h2 className="text-xl font-light text-blue-200 mb-2">No playlists found</h2>
            <p className="text-blue-300 font-light">Try a different search term</p>
          </div>
        )}

        {/* Playlists Grid */}
        {!loading && filteredPlaylists.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlaylists.map((playlist, index) => (
              <div 
                key={playlist.id} 
                className="group bg-slate-800/40 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer border border-blue-500/20"
                onClick={() => navigate(`/playlists/${playlist.id}`)}
              >
                {/* Cover Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={getImageUrl(playlist.coverImage, index)} 
                    alt={playlist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Hover Actions */}
                  <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/playlists/${playlist.id}`);
                      }}
                      className="p-3 bg-white/90 hover:bg-white rounded-full transition-colors shadow-lg"
                    >
                      <Play className="h-5 w-5 text-gray-800" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlaylist(playlist);
                        setEditDialogOpen(true);
                      }}
                      className="p-3 bg-white/90 hover:bg-white rounded-full transition-colors shadow-lg"
                    >
                      <Pencil className="h-5 w-5 text-gray-800" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlaylist(playlist);
                        setDeleteDialogOpen(true);
                      }}
                      className="p-3 bg-white/90 hover:bg-white rounded-full transition-colors shadow-lg"
                    >
                      <Trash2 className="h-5 w-5 text-red-600" />
                    </button>
                  </div>

                  {/* Stats Badge */}
                  <div className="absolute bottom-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
                    10.5K Cozies
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-800 mb-1 truncate">{playlist.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem] font-light">
                    {playlist.description || 'A collection of amazing tracks from ambient vibes'}
                  </p>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      <span>1309 Aww sweet</span>
                    </div>
                    <span>12:16</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
