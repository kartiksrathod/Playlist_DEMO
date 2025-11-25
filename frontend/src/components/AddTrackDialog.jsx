import React, { useState } from 'react';
import axios from 'axios';
import { Upload, Link2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AddTrackDialog = ({ open, onOpenChange, playlistId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [audioFileName, setAudioFileName] = useState('');
  
  const [formData, setFormData] = useState({
    songName: '',
    artist: '',
    album: '',
    duration: '',
    audioUrl: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/aac', 'audio/flac', 'audio/x-m4a'];
      if (!allowedTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|m4a|aac|flac|wma)$/i)) {
        toast.error('Please select a valid audio file (mp3, wav, ogg, m4a, aac, flac, wma)');
        return;
      }

      // Validate file size (50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast.error('File size must be less than 50MB');
        return;
      }

      setAudioFile(file);
      setAudioFileName(file.name);
    }
  };

  const handleRemoveFile = () => {
    setAudioFile(null);
    setAudioFileName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.songName.trim()) {
      toast.error('Song name is required');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('songName', formData.songName.trim());
      formDataToSend.append('artist', formData.artist.trim());
      formDataToSend.append('album', formData.album.trim());
      formDataToSend.append('duration', formData.duration.trim());
      formDataToSend.append('audioUrl', formData.audioUrl.trim());
      
      if (audioFile) {
        formDataToSend.append('audioFile', audioFile);
      }

      await axios.post(`${API}/playlists/${playlistId}/tracks`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Track added successfully');
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Error adding track:', error);
      toast.error(error.response?.data?.message || 'Failed to add track');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      songName: '',
      artist: '',
      album: '',
      duration: '',
      audioUrl: '',
    });
    setAudioFile(null);
    setAudioFileName('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Track</DialogTitle>
          <DialogDescription>
            Add a new track to your playlist. You can provide an audio URL or upload an audio file.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Song Name */}
            <div className="space-y-2">
              <Label htmlFor="songName">
                Song Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="songName"
                name="songName"
                value={formData.songName}
                onChange={handleChange}
                placeholder="Enter song name"
                required
              />
            </div>

            {/* Artist */}
            <div className="space-y-2">
              <Label htmlFor="artist">Artist</Label>
              <Input
                id="artist"
                name="artist"
                value={formData.artist}
                onChange={handleChange}
                placeholder="Enter artist name"
              />
            </div>

            {/* Album */}
            <div className="space-y-2">
              <Label htmlFor="album">Album</Label>
              <Input
                id="album"
                name="album"
                value={formData.album}
                onChange={handleChange}
                placeholder="Enter album name"
              />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g., 3:45"
              />
            </div>

            {/* Audio Source - Tabs */}
            <div className="space-y-2">
              <Label>Audio Source</Label>
              <Tabs defaultValue="url" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="url">
                    <Link2 className="h-4 w-4 mr-2" />
                    URL
                  </TabsTrigger>
                  <TabsTrigger value="file">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="url" className="space-y-2">
                  <Input
                    id="audioUrl"
                    name="audioUrl"
                    value={formData.audioUrl}
                    onChange={handleChange}
                    placeholder="Paste audio URL (YouTube, Spotify, etc.)"
                    type="url"
                  />
                  <p className="text-xs text-muted-foreground">
                    Paste a link to the audio from YouTube, Spotify, or any other source
                  </p>
                </TabsContent>

                <TabsContent value="file" className="space-y-2">
                  {!audioFile ? (
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
                      onClick={() => document.getElementById('audioFile')?.click()}
                    >
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-1">
                        Click to upload audio file
                      </p>
                      <p className="text-xs text-muted-foreground">
                        MP3, WAV, OGG, M4A, AAC, FLAC (max 50MB)
                      </p>
                      <Input
                        id="audioFile"
                        type="file"
                        accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac,.flac,.wma"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="border border-border rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Upload className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium truncate">{audioFileName}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveFile}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Track'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTrackDialog;
