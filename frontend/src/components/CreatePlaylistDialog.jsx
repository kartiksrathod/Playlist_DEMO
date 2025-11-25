import React, { useState } from 'react';
import axios from 'axios';
import { Upload, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CreatePlaylistDialog = ({ open, onOpenChange, onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setCoverImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setCoverImage(null);
    setImagePreview(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter a playlist name');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('description', description.trim());
      
      if (coverImage) {
        formData.append('coverImage', coverImage);
      }

      await axios.post(`${API}/playlists`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Playlist created successfully!');
      
      // Reset form
      setName('');
      setDescription('');
      setCoverImage(null);
      setImagePreview(null);
      
      // Close dialog and refresh
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating playlist:', error);
      toast.error(error.response?.data?.message || 'Failed to create playlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Playlist</DialogTitle>
          <DialogDescription>
            Add a new playlist to your collection. Give it a name and optionally add a cover image.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name">Playlist Name *</Label>
              <Input
                id="name"
                placeholder="My Awesome Playlist"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Add a description for your playlist..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Cover Image Upload */}
            <div className="space-y-2">
              <Label>Cover Image</Label>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                  <input
                    type="file"
                    id="coverImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label htmlFor="coverImage" className="cursor-pointer">
                    <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-1">
                      Click to upload cover image
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Playlist'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePlaylistDialog;
