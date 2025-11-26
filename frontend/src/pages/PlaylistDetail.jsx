import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Music, Pencil, Trash2, Play, Pause, MoreVertical, PlayCircle } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import AddTrackDialog from '@/components/AddTrackDialog';
import EditTrackDialog from '@/components/EditTrackDialog';
import { toast } from 'sonner';
import { usePlayer } from '@/context/PlayerContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Default image for playlists without cover
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1699116548118-1605ae766335?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjBsYWtlfGVufDB8fHxvcmFuZ2V8MTc2NDA5NjczOXww&ixlib=rb-4.1.0&q=85';

const PlaylistDetail = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  
  // Get player context
  const { play, currentTrack, isPlaying, playAll } = usePlayer();

  // Fetch playlist details
  const fetchPlaylist = async () => {
    try {
      const response = await axios.get(`${API}/playlists/${playlistId}`);
      setPlaylist(response.data);
    } catch (error) {
      console.error('Error fetching playlist:', error);
      toast.error('Failed to load playlist');
      navigate('/playlists');
    }
  };

  // Fetch tracks
  const fetchTracks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/playlists/${playlistId}/tracks`);
      setTracks(response.data);
    } catch (error) {
      console.error('Error fetching tracks:', error);
      toast.error('Failed to load tracks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylist();
    fetchTracks();
  }, [playlistId]);

  // Handle delete track
  const handleDeleteTrack = async () => {
    if (!selectedTrack) return;

    try {
      await axios.delete(`${API}/playlists/${playlistId}/tracks/${selectedTrack.id}`);
      toast.success('Track deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedTrack(null);
      fetchTracks();
    } catch (error) {
      console.error('Error deleting track:', error);
      toast.error('Failed to delete track');
    }
  };

  // Handle play track
  const handlePlayTrack = (track) => {
    // Add playlist info and cover image to track
    const trackWithPlaylist = {
      ...track,
      playlistId: playlist.id,
      coverImage: playlist.coverImage,
    };
    play(trackWithPlaylist, playlist);
  };

  // Handle play all tracks
  const handlePlayAll = () => {
    if (tracks.length === 0) {
      toast.error('No tracks to play');
      return;
    }
    
    // Add playlist info to all tracks
    const tracksWithPlaylist = tracks.map(track => ({
      ...track,
      playlistId: playlist.id,
      coverImage: playlist.coverImage,
    }));
    
    playAll(tracksWithPlaylist, 0, playlist);
  };

  // Get image URL
  const getImageUrl = (coverImage) => {
    if (!coverImage) return DEFAULT_IMAGE;
    return `${BACKEND_URL}${coverImage}`;
  };

  // Get source badge
  const getSourceBadge = (track) => {
    if (track.audioFile) return { label: 'Uploaded', color: 'bg-green-100 text-green-700' };
    if (track.audioUrl) {
      if (track.audioUrl.includes('youtube')) return { label: 'YouTube', color: 'bg-red-100 text-red-700' };
      if (track.audioUrl.includes('spotify')) return { label: 'Spotify', color: 'bg-green-100 text-green-700' };
      if (track.audioUrl.includes('soundcloud')) return { label: 'SoundCloud', color: 'bg-orange-100 text-orange-700' };
      return { label: 'URL', color: 'bg-blue-100 text-blue-700' };
    }
    return null;
  };

  if (!playlist) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen relative bg-slate-950">
        {/* Cinematic Video Background - Nature/Urban Scenes */}
        <div className="fixed inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="https://cdn.pixabay.com/video/2022/11/07/137716-768970096_large.mp4" type="video/mp4" />
          </video>
          {/* Softer, darker overlay for eye comfort */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-blue-950/88 to-slate-950/92" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10">
          {/* Back Button */}
          <div className="px-8 pt-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/playlists')}
              className="hover:bg-blue-900/40 text-blue-50 hover:text-white rounded-xl -ml-2 backdrop-blur-xl border border-blue-800/20 shadow-lg"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Playlists
            </Button>
          </div>

          {/* Playlist Header - Enhanced Glassmorphism Style */}
          <div className="px-8 py-6">
            <div className="relative h-64 rounded-3xl overflow-hidden shadow-2xl mb-6 bg-slate-900/40 backdrop-blur-2xl border border-blue-700/30">
              <img 
                src={getImageUrl(playlist.coverImage)} 
                alt={playlist.name}
                className="w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/95 via-slate-950/70 to-transparent" />
              
              {/* Playlist Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h1 className="text-5xl font-light mb-3 text-white drop-shadow-2xl">{playlist.name}</h1>
                <p className="text-lg text-blue-50 font-light mb-2 drop-shadow-lg">
                  {playlist.description || 'A collection of beautiful tracks'}
                </p>
                <div className="flex items-center gap-4 text-sm text-blue-100">
                  <span>{tracks.length} tracks</span>
                  <span>•</span>
                  <span>Immersive experience</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mb-6 flex gap-4">
              {tracks.length > 0 && (
                <Button 
                  onClick={handlePlayAll}
                  className="px-6 py-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-xl shadow-2xl hover:shadow-green-600/60 transition-all backdrop-blur-xl border border-green-500/30"
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Play All
                </Button>
              )}
              <Button 
                onClick={() => setAddDialogOpen(true)}
                className="px-6 py-6 bg-blue-700 hover:bg-blue-600 text-white rounded-xl shadow-2xl hover:shadow-blue-600/60 transition-all backdrop-blur-xl border border-blue-500/30"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add Track
              </Button>
            </div>
          </div>

          {/* Tracks Section */}
          <div className="px-8 pb-8">
            {/* Loading State */}
            {loading && (
              <div className="bg-slate-900/50 backdrop-blur-2xl rounded-2xl shadow-2xl p-6 border border-blue-700/30">
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 animate-pulse">
                      <div className="w-12 h-12 bg-blue-900/40 rounded" />
                      <div className="flex-1">
                        <div className="h-4 bg-blue-900/40 rounded w-1/3 mb-2" />
                        <div className="h-3 bg-blue-900/40 rounded w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading && tracks.length === 0 && (
              <div className="bg-slate-900/50 backdrop-blur-2xl rounded-2xl shadow-2xl p-16 border border-blue-700/30">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mb-6 shadow-2xl shadow-blue-700/60">
                    <Music className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-light text-white mb-2">No tracks yet</h2>
                  <p className="text-blue-50 mb-6 font-light">Add your first track to this playlist</p>
                  <Button 
                    onClick={() => setAddDialogOpen(true)}
                    className="px-6 py-3 bg-blue-700 hover:bg-blue-600 text-white rounded-xl shadow-2xl shadow-blue-700/50 backdrop-blur-xl border border-blue-500/30"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Track
                  </Button>
                </div>
              </div>
            )}

            {/* Tracks Table */}
            {!loading && tracks.length > 0 && (
              <div className="bg-slate-900/50 backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden border border-blue-700/30">
                {/* Table Header */}
                <div className="px-6 py-4 border-b border-blue-700/30 bg-slate-950/60">
                  <div className="grid grid-cols-12 gap-4 text-xs font-medium text-blue-200 uppercase tracking-wider">
                    <div className="col-span-1">#</div>
                    <div className="col-span-5">Title</div>
                    <div className="col-span-2">Source</div>
                    <div className="col-span-2">Duration</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-blue-800/20">
                  {tracks.map((track, index) => {
    const sourceBadge = getSourceBadge(track);
                    const isCurrentTrack = currentTrack?.id === track.id;
                    const isTrackPlaying = isCurrentTrack && isPlaying;
                    
                    return (
                      <div 
                        key={track.id} 
                        className="px-6 py-4 hover:bg-blue-900/30 transition-colors group"
                      >
                        <div className="grid grid-cols-12 gap-4 items-center">
                          {/* Track Number / Play Button */}
                          <div className="col-span-1">
                            {(track.audioFile || track.audioUrl) ? (
                              <button
                                onClick={() => handlePlayTrack(track)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                  isTrackPlaying 
                                    ? 'bg-green-600 text-white shadow-xl shadow-green-600/60' 
                                    : 'bg-blue-900/40 hover:bg-blue-600 hover:text-white text-blue-200 backdrop-blur-sm border border-blue-700/30'
                                }`}
                              >
                                {isTrackPlaying ? (
                                  <Pause className="h-4 w-4" />
                                ) : (
                                  <Play className="h-4 w-4 ml-0.5" />
                                )}
                              </button>
                            ) : (
                              <span className="text-blue-300 font-medium">{index + 1}</span>
                            )}
                          </div>

                          {/* Track Info */}
                          <div className="col-span-5">
                            <h3 className="font-medium text-white truncate drop-shadow-sm">{track.songName}</h3>
                            <p className="text-sm text-blue-100 truncate font-light">
                              {track.artist || 'Unknown Artist'}
                              {track.album && ` • ${track.album}`}
                            </p>
                          </div>

                          {/* Source */}
                          <div className="col-span-2">
                            {sourceBadge && (
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${sourceBadge.color} backdrop-blur-sm`}>
                                {sourceBadge.label}
                              </span>
                            )}
                          </div>

                          {/* Duration */}
                          <div className="col-span-2 text-blue-200 text-sm">
                            {track.duration || '—'}
                          </div>

                          {/* Actions */}
                          <div className="col-span-2 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setSelectedTrack(track);
                                setEditDialogOpen(true);
                              }}
                              className="p-2 hover:bg-blue-800/50 rounded-lg transition-colors backdrop-blur-sm"
                            >
                              <Pencil className="h-4 w-4 text-blue-200" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedTrack(track);
                                setDeleteDialogOpen(true);
                              }}
                              className="p-2 hover:bg-red-800/50 rounded-lg transition-colors backdrop-blur-sm"
                            >
                              <Trash2 className="h-4 w-4 text-red-300" />
                            </button>
                            <button className="p-2 hover:bg-blue-800/50 rounded-lg transition-colors backdrop-blur-sm">
                              <MoreVertical className="h-4 w-4 text-blue-200" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Track Dialog */}
        <AddTrackDialog 
          open={addDialogOpen} 
          onOpenChange={setAddDialogOpen}
          playlistId={playlistId}
          onSuccess={fetchTracks}
        />

        {/* Edit Track Dialog */}
        {selectedTrack && (
          <EditTrackDialog 
            open={editDialogOpen} 
            onOpenChange={setEditDialogOpen}
            playlistId={playlistId}
            track={selectedTrack}
            onSuccess={fetchTracks}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="bg-white rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Track?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete "{selectedTrack?.songName}" from this playlist. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSelectedTrack(null)} className="rounded-xl">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteTrack} 
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

export default PlaylistDetail;
