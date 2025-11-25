import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Music, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import CreatePlaylistDialog from '@/components/CreatePlaylistDialog';
import EditPlaylistDialog from '@/components/EditPlaylistDialog';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
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
  const getImageUrl = (coverImage) => {
    if (!coverImage) return null;
    return `${BACKEND_URL}${coverImage}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">My Playlists</h1>
            <p className="text-muted-foreground">Create and manage your music playlists</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Create Playlist
          </Button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg" />
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && playlists.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Music className="h-24 w-24 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">No playlists yet</h2>
            <p className="text-muted-foreground mb-6">Create your first playlist to get started</p>
            <Button onClick={() => setCreateDialogOpen(true)} size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Create Your First Playlist
            </Button>
          </div>
        )}

        {/* Playlists Grid */}
        {!loading && playlists.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {playlists.map((playlist) => (
              <Card key={playlist.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                {/* Cover Image */}
                <div className="relative h-48 bg-gradient-to-br from-purple-500 to-pink-500 overflow-hidden">
                  {playlist.coverImage ? (
                    <img 
                      src={getImageUrl(playlist.coverImage)} 
                      alt={playlist.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music className="h-16 w-16 text-white opacity-50" />
                    </div>
                  )}
                  
                  {/* Action Buttons - Show on hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setSelectedPlaylist(playlist);
                        setEditDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setSelectedPlaylist(playlist);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Card Content */}
                <CardHeader>
                  <CardTitle className="truncate">{playlist.name}</CardTitle>
                  <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                    {playlist.description || 'No description'}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="text-xs text-muted-foreground">
                  Created {new Date(playlist.createdAt).toLocaleDateString()}
                </CardFooter>
              </Card>
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
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the playlist "{selectedPlaylist?.name}". This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSelectedPlaylist(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Playlists;
