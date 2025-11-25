import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Music, Pencil, Trash2, Play, Pause, MoreVertical } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import AddTrackDialog from '@/components/AddTrackDialog';
import EditTrackDialog from '@/components/EditTrackDialog';
import { toast } from 'sonner';

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
  const [playingTrack, setPlayingTrack] = useState(null);
  const [audioElement, setAudioElement] = useState(null);

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

  // Get audio URL
  const getAudioUrl = (track) => {
    if (track.audioFile) {
      return `${BACKEND_URL}${track.audioFile}`;
    }
    return track.audioUrl || null;
  };

  // Handle play/pause
  const togglePlay = (track) => {
    const audioUrl = getAudioUrl(track);
    if (!audioUrl) {
      toast.error('No audio available for this track');
      return;
    }

    // If same track, toggle play/pause
    if (playingTrack?.id === track.id && audioElement) {
      if (audioElement.paused) {
        audioElement.play();
        setPlayingTrack(track);
      } else {
        audioElement.pause();
        setPlayingTrack(null);
      }
      return;
    }

    // Stop current audio if playing
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }

    // Create and play new audio
    const audio = new Audio(audioUrl);
    audio.play();
    audio.onended = () => setPlayingTrack(null);
    audio.onerror = () => {
      toast.error('Failed to play audio');
      setPlayingTrack(null);
    };
    setAudioElement(audio);
    setPlayingTrack(track);
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
    };
  }, [audioElement]);

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
      <div className="min-h-screen">
        {/* Back Button */}
        <div className="px-8 pt-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/playlists')}
            className="hover:bg-gray-100 rounded-xl -ml-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Playlists
          </Button>
        </div>

        {/* Playlist Header with Large Banner */}
        <div className="px-8 py-6">
          <div className="relative h-64 rounded-3xl overflow-hidden shadow-xl mb-6">
            <img 
              src={getImageUrl(playlist.coverImage)} 
              alt={playlist.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            {/* Playlist Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h1 className="text-5xl font-light mb-3">{playlist.name}</h1>
              <p className="text-lg text-white/90 font-light mb-2">
                {playlist.description || 'A collection of upbeat tracks to start the day'}
              </p>
              <div className="flex items-center gap-4 text-sm text-white/80">
                <span>{tracks.length} tracks</span>
                <span>•</span>
                <span>From ambient vibes</span>
              </div>
            </div>
          </div>

          {/* Add Track Button */}
          <div className="mb-6">
            <Button 
              onClick={() => setAddDialogOpen(true)}
              className="px-6 py-6 bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
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
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 animate-pulse">
                    <div className="w-12 h-12 bg-gray-200 rounded" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && tracks.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-16">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-6">
                  <Music className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-2xl font-light text-gray-800 mb-2">No tracks yet</h2>
                <p className="text-gray-600 mb-6 font-light">Add your first track to this playlist</p>
                <Button 
                  onClick={() => setAddDialogOpen(true)}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Track
                </Button>
              </div>
            </div>
          )}

          {/* Tracks Table */}
          {!loading && tracks.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Table Header */}
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                  <div className="col-span-1">#</div>
                  <div className="col-span-5">Title</div>
                  <div className="col-span-2">Source</div>
                  <div className="col-span-2">Duration</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100">
                {tracks.map((track, index) => {
                  const sourceBadge = getSourceBadge(track);
                  const isPlaying = playingTrack?.id === track.id;
                  
                  return (
                    <div 
                      key={track.id} 
                      className="px-6 py-4 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Track Number / Play Button */}
                        <div className="col-span-1">
                          {getAudioUrl(track) ? (
                            <button
                              onClick={() => togglePlay(track)}
                              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                isPlaying 
                                  ? 'bg-amber-500 text-white' 
                                  : 'bg-gray-100 hover:bg-amber-500 hover:text-white text-gray-600'
                              }`}
                            >
                              {isPlaying ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4 ml-0.5" />
                              )}
                            </button>
                          ) : (
                            <span className="text-gray-400 font-medium">{index + 1}</span>
                          )}
                        </div>

                        {/* Track Info */}
                        <div className="col-span-5">
                          <h3 className="font-medium text-gray-800 truncate">{track.songName}</h3>
                          <p className="text-sm text-gray-600 truncate font-light">
                            {track.artist || 'Unknown Artist'}
                            {track.album && ` • ${track.album}`}
                          </p>
                        </div>

                        {/* Source */}
                        <div className="col-span-2">
                          {sourceBadge && (
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${sourceBadge.color}`}>
                              {sourceBadge.label}
                            </span>
                          )}
                        </div>

                        {/* Duration */}
                        <div className="col-span-2 text-gray-600 text-sm">
                          {track.duration || '—'}
                        </div>

                        {/* Actions */}
                        <div className="col-span-2 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setSelectedTrack(track);
                              setEditDialogOpen(true);
                            }}
                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            <Pencil className="h-4 w-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTrack(track);
                              setDeleteDialogOpen(true);
                            }}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                          <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                            <MoreVertical className="h-4 w-4 text-gray-600" />
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
