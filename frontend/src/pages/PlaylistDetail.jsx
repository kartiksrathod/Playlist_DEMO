import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Music, Pencil, Trash2, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import AddTrackDialog from '@/components/AddTrackDialog';
import EditTrackDialog from '@/components/EditTrackDialog';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

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
    if (!coverImage) return null;
    return `${BACKEND_URL}${coverImage}`;
  };

  if (!playlist) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/playlists')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Playlists
        </Button>

        {/* Playlist Header */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="w-full md:w-64 h-64 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
            {playlist.coverImage ? (
              <img 
                src={getImageUrl(playlist.coverImage)} 
                alt={playlist.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Music className="h-24 w-24 text-white opacity-50" />
              </div>
            )}
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-5xl font-bold text-foreground mb-2">{playlist.name}</h1>
            <p className="text-xl text-muted-foreground mb-4">
              {playlist.description || 'No description'}
            </p>
            <p className="text-sm text-muted-foreground">
              {tracks.length} {tracks.length === 1 ? 'track' : 'tracks'}
            </p>
          </div>
        </div>

        {/* Add Track Button */}
        <div className="mb-6">
          <Button onClick={() => setAddDialogOpen(true)} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Add Track
          </Button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-muted rounded" />
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                      <div className="h-3 bg-muted rounded w-1/4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && tracks.length === 0 && (
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <Music className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">No tracks yet</h2>
              <p className="text-muted-foreground mb-6">Add your first track to this playlist</p>
              <Button onClick={() => setAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Track
              </Button>
            </div>
          </Card>
        )}

        {/* Tracks List */}
        {!loading && tracks.length > 0 && (
          <div className="space-y-3">
            {tracks.map((track, index) => (
              <Card key={track.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Track Number / Play Button */}
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                      {getAudioUrl(track) ? (
                        <Button
                          size="sm"
                          variant={playingTrack?.id === track.id ? "default" : "outline"}
                          className="h-10 w-10 rounded-full p-0"
                          onClick={() => togglePlay(track)}
                        >
                          {playingTrack?.id === track.id ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4 ml-0.5" />
                          )}
                        </Button>
                      ) : (
                        <span className="text-lg font-semibold text-muted-foreground">
                          {index + 1}
                        </span>
                      )}
                    </div>

                    {/* Track Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{track.songName}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {track.artist || 'Unknown Artist'} {track.album && `• ${track.album}`}
                      </p>
                    </div>

                    {/* Duration */}
                    {track.duration && (
                      <div className="hidden sm:block text-sm text-muted-foreground">
                        {track.duration}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedTrack(track);
                          setEditDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedTrack(track);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

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
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete "{selectedTrack?.songName}" from this playlist. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSelectedTrack(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteTrack} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default PlaylistDetail;
