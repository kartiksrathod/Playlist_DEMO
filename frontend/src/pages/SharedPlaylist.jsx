import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Music, PlayCircle, Clock } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { formatDuration } from '@/lib/utils';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SharedPlaylist = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    fetchSharedPlaylist();
  }, [token]);

  const fetchSharedPlaylist = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/playlists/shared/${token}`);
      setPlaylist(response.data.playlist);
      setTracks(response.data.tracks || []);
    } catch (error) {
      console.error('Error fetching shared playlist:', error);
      toast.error('Failed to load shared playlist');
      navigate('/playlists');
    } finally {
      setLoading(false);
    }
  };

  const handleImportPlaylist = async () => {
    try {
      setImporting(true);
      const response = await axios.post(`${API}/playlists/import/${token}`);
      toast.success('Playlist imported successfully!');
      navigate(`/playlists/${response.data.id}`);
    } catch (error) {
      console.error('Error importing playlist:', error);
      toast.error('Failed to import playlist');
    } finally {
      setImporting(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    );
  }

  const coverImage = playlist?.coverImage 
    ? `${BACKEND_URL}${playlist.coverImage}` 
    : 'https://images.unsplash.com/photo-1699116548118-1605ae766335?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjBsYWtlfGVufDB8fHxvcmFuZ2V8MTc2NDA5NjczOXww&ixlib=rb-4.1.0&q=85';

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/playlists')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Playlist Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 p-8 backdrop-blur-sm border border-white/10">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Cover Image */}
            <div className="w-48 h-48 rounded-xl overflow-hidden shadow-2xl flex-shrink-0">
              <img
                src={coverImage}
                alt={playlist?.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Playlist Info */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 mb-3">
                  Shared Playlist
                </div>
                <h1 className="text-4xl font-bold mb-2">{playlist?.name}</h1>
                {playlist?.description && (
                  <p className="text-muted-foreground text-lg">{playlist?.description}</p>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Music className="h-4 w-4" />
                  <span>{tracks.length} {tracks.length === 1 ? 'track' : 'tracks'}</span>
                </div>
                {playlist?.isPublic && (
                  <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                    Public
                  </div>
                )}
                {playlist?.isCollaborative && (
                  <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                    Collaborative
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleImportPlaylist}
                  disabled={importing}
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  <Download className="h-5 w-5 mr-2" />
                  {importing ? 'Importing...' : 'Import to My Library'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tracks List */}
        <div className="bg-card rounded-xl p-6 border">
          <h2 className="text-xl font-semibold mb-4">Tracks</h2>
          
          {tracks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Music className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No tracks in this playlist</p>
            </div>
          ) : (
            <div className="space-y-1">
              {tracks.map((track, index) => (
                <div
                  key={track.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="w-8 text-center text-muted-foreground text-sm">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{track.songName}</div>
                    {track.artist && (
                      <div className="text-sm text-muted-foreground truncate">{track.artist}</div>
                    )}
                  </div>

                  {track.album && (
                    <div className="hidden md:block text-sm text-muted-foreground truncate max-w-xs">
                      {track.album}
                    </div>
                  )}

                  {track.duration && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatDuration(track.duration)}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Import CTA at Bottom */}
        {tracks.length > 0 && (
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20 text-center">
            <h3 className="text-lg font-semibold mb-2">Like this playlist?</h3>
            <p className="text-muted-foreground mb-4">
              Import it to your library and start listening!
            </p>
            <Button
              onClick={handleImportPlaylist}
              disabled={importing}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              <Download className="h-5 w-5 mr-2" />
              {importing ? 'Importing...' : 'Import Playlist'}
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default SharedPlaylist;
