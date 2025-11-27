import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Share2, Copy, Check, Link as LinkIcon, Globe, Users } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SharePlaylistDialog = ({ open, onOpenChange, playlist, onUpdate }) => {
  const [shareToken, setShareToken] = useState(null);
  const [isPublic, setIsPublic] = useState(false);
  const [isCollaborative, setIsCollaborative] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && playlist) {
      setShareToken(playlist.shareToken || null);
      setIsPublic(playlist.isPublic || false);
      setIsCollaborative(playlist.isCollaborative || false);
    }
  }, [open, playlist]);

  // Generate share token
  const handleGenerateShareToken = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${API}/playlists/${playlist.id}/share`);
      setShareToken(response.data.shareToken);
      toast.success('Share link generated!');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error generating share token:', error);
      toast.error('Failed to generate share link');
    } finally {
      setLoading(false);
    }
  };

  // Copy share link to clipboard
  const handleCopyLink = () => {
    const shareLink = `${window.location.origin}/shared/${shareToken}`;
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Toggle public status
  const handleTogglePublic = async () => {
    try {
      setLoading(true);
      const response = await axios.put(`${API}/playlists/${playlist.id}/toggle-public`);
      setIsPublic(response.data.isPublic);
      toast.success(response.data.isPublic ? 'Playlist is now public' : 'Playlist is now private');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error toggling public status:', error);
      toast.error('Failed to update playlist visibility');
    } finally {
      setLoading(false);
    }
  };

  // Toggle collaborative status
  const handleToggleCollaborative = async () => {
    try {
      setLoading(true);
      const response = await axios.put(`${API}/playlists/${playlist.id}/toggle-collaborative`);
      setIsCollaborative(response.data.isCollaborative);
      toast.success(response.data.isCollaborative ? 'Collaborative mode enabled' : 'Collaborative mode disabled');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error toggling collaborative status:', error);
      toast.error('Failed to update collaborative mode');
    } finally {
      setLoading(false);
    }
  };

  const shareLink = shareToken ? `${window.location.origin}/shared/${shareToken}` : '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-blue-500" />
              Share Playlist
            </DialogTitle>
            <DialogDescription>
              Share "{playlist?.name}" with others
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Public/Private Toggle */}
            <motion.div 
              className="flex items-center justify-between p-4 bg-muted rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: isPublic ? 360 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Globe className="h-5 w-5 text-green-500" />
                </motion.div>
                <div>
                  <Label className="text-sm font-medium">Public Playlist</Label>
                  <p className="text-xs text-muted-foreground">
                    {isPublic ? 'Anyone can discover this playlist' : 'Only people with the link can view'}
                  </p>
                </div>
              </div>
              <Switch
                checked={isPublic}
                onCheckedChange={handleTogglePublic}
                disabled={loading}
              />
            </motion.div>

            {/* Collaborative Toggle */}
            <motion.div 
              className="flex items-center justify-between p-4 bg-muted rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: isCollaborative ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Users className="h-5 w-5 text-purple-500" />
                </motion.div>
                <div>
                  <Label className="text-sm font-medium">Collaborative</Label>
                  <p className="text-xs text-muted-foreground">
                    {isCollaborative ? 'Others can add tracks' : 'Only you can edit'}
                  </p>
                </div>
              </div>
              <Switch
                checked={isCollaborative}
                onCheckedChange={handleToggleCollaborative}
                disabled={loading}
              />
            </motion.div>

            {/* Share Link Section */}
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Label className="flex items-center gap-2 text-sm font-medium">
                <LinkIcon className="h-4 w-4 text-blue-500" />
                Share Link
              </Label>

              <AnimatePresence mode="wait">
                {!shareToken ? (
                  <motion.div
                    key="generate-button"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleGenerateShareToken}
                      disabled={loading}
                      className="w-full"
                      variant="outline"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Generate Share Link
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="share-link"
                    className="space-y-2"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <div className="flex gap-2">
                      <Input
                        value={shareLink}
                        readOnly
                        className="flex-1 font-mono text-xs"
                      />
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          size="sm"
                          onClick={handleCopyLink}
                          variant={copied ? "default" : "outline"}
                        >
                          <AnimatePresence mode="wait">
                            {copied ? (
                              <motion.div
                                key="copied"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Copied
                              </motion.div>
                            ) : (
                              <motion.div
                                key="copy"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center"
                              >
                                <Copy className="h-4 w-4 mr-1" />
                                Copy
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Button>
                      </motion.div>
                    </div>
                    <motion.p 
                      className="text-xs text-muted-foreground"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      Anyone with this link can view and import this playlist
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Status Badges */}
            <motion.div 
              className="flex gap-2 flex-wrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <AnimatePresence>
                {isPublic && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  >
                    <Globe className="h-3 w-3 mr-1" />
                    Public
                  </motion.div>
                )}
                {isCollaborative && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                  >
                    <Users className="h-3 w-3 mr-1" />
                    Collaborative
                  </motion.div>
                )}
                {!isPublic && !isCollaborative && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                  >
                    Private
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default SharePlaylistDialog;
