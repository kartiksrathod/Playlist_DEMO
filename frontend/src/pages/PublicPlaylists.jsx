import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Music, Download, PlayCircle, ArrowLeft } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1699116548118-1605ae766335?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjBsYWtlfGVufDB8fHxvcmFuZ2V8MTc2NDA5NjczOXww&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1583883175425-46dee3845e7f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwzfHxnb2xkZW4lMjBob3VyJTIwbmF0dXJlfGVufDB8fHxvcmFuZ2V8MTc2NDA5Njc1MHww&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1656648497153-a826258d2886?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHw0fHxnb2xkZW4lMjBob3VyJTIwbmF0dXJlfGVufDB8fHxvcmFuZ2V8MTc2NDA5Njc1MHww&ixlib=rb-4.1.0&q=85',
];

const PublicPlaylists = () => {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importingIds, setImportingIds] = useState(new Set());

  useEffect(() => {
    fetchPublicPlaylists();
  }, []);

  const fetchPublicPlaylists = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/playlists/public`);
      setPlaylists(response.data);
    } catch (error) {
      console.error('Error fetching public playlists:', error);
      toast.error('Failed to load public playlists');
    } finally {
      setLoading(false);
    }
  };

  const handleImportPlaylist = async (playlist, e) => {
    e.stopPropagation();
    
    if (!playlist.shareToken) {
      toast.error('This playlist cannot be imported');
      return;
    }

    try {
      setImportingIds(prev => new Set([...prev, playlist.id]));
      const response = await axios.post(`${API}/playlists/import/${playlist.shareToken}`);
      toast.success('Playlist imported successfully!');
      navigate(`/playlists/${response.data.id}`);
    } catch (error) {
      console.error('Error importing playlist:', error);
      toast.error('Failed to import playlist');
      setImportingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(playlist.id);
        return newSet;
      });
    }
  };

  const handleViewPlaylist = (playlist) => {
    if (playlist.shareToken) {
      navigate(`/shared/${playlist.shareToken}`);
    }
  };

  const getImageUrl = (playlist, index) => {
    if (playlist.coverImage) {
      return `${BACKEND_URL}${playlist.coverImage}`;
    }
    return DEFAULT_IMAGES[index % DEFAULT_IMAGES.length];
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-10 bg-muted animate-pulse rounded w-48" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl p-4 border animate-pulse">
                <div className="aspect-square bg-muted rounded-lg mb-4" />
                <div className="h-6 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/playlists')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Playlists
            </Button>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Public Playlists</h1>
                <p className="text-muted-foreground">Discover playlists shared by the community</p>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {playlists.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-xl border">
            <Globe className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Public Playlists Yet</h3>
            <p className="text-muted-foreground mb-6">
              Be the first to share a playlist publicly!
            </p>
            <Button onClick={() => navigate('/playlists')}>
              Go to My Playlists
            </Button>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-green-500" />
                <span className="text-muted-foreground">
                  {playlists.length} public {playlists.length === 1 ? 'playlist' : 'playlists'} available
                </span>
              </div>
            </div>

            {/* Playlists Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {playlists.map((playlist, index) => (
                  <motion.div
                    key={playlist.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative bg-card rounded-xl overflow-hidden border hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => handleViewPlaylist(playlist)}
                  >
                    {/* Cover Image */}
                    <div className="aspect-square overflow-hidden relative">
                      <img
                        src={getImageUrl(playlist, index)}
                        alt={playlist.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                          <Button
                            size="sm"
                            onClick={(e) => handleImportPlaylist(playlist, e)}
                            disabled={importingIds.has(playlist.id)}
                            className="flex-1 bg-white text-black hover:bg-white/90"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            {importingIds.has(playlist.id) ? 'Importing...' : 'Import'}
                          </Button>
                        </div>
                      </div>

                      {/* Public Badge */}
                      <div className="absolute top-3 left-3">
                        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white shadow-lg">
                          <Globe className="h-3 w-3 mr-1" />
                          Public
                        </div>
                      </div>

                      {/* Collaborative Badge */}
                      {playlist.isCollaborative && (
                        <div className="absolute top-3 right-3">
                          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-500 text-white shadow-lg">
                            Collaborative
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Playlist Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1 truncate group-hover:text-primary transition-colors">
                        {playlist.name}
                      </h3>
                      {playlist.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {playlist.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Music className="h-3 w-3" />
                        <span>Shared playlist</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default PublicPlaylists;
