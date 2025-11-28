import React, { useState, useEffect } from 'react';
import { Clock, Play, TrendingUp, Calendar, Trash2 } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import axios from 'axios';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const API = process.env.REACT_APP_BACKEND_URL || '';

const History = () => {
  const { themeConfig } = useTheme();
  const [sortBy, setSortBy] = useState('recent'); // recent, mostPlayed, oldest
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({
    totalPlays: 0,
    uniqueTracks: 0,
    playsThisWeek: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showClearDialog, setShowClearDialog] = useState(false);

  // Fetch history data
  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/api/history?limit=100`);
      setHistory(response.data.history || []);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats data
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/api/history/stats`);
      setStats({
        totalPlays: response.data.totalPlays || 0,
        uniqueTracks: response.data.uniqueTracks || 0,
        playsThisWeek: response.data.playsThisWeek || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchHistory();
    fetchStats();
  }, []);

  // Clear history handler
  const handleClearHistory = async () => {
    try {
      await axios.delete(`${API}/api/history`);
      setHistory([]);
      setStats({ totalPlays: 0, uniqueTracks: 0, playsThisWeek: 0 });
      toast.success('History cleared successfully');
      setShowClearDialog(false);
    } catch (error) {
      console.error('Error clearing history:', error);
      toast.error('Failed to clear history');
    }
  };

  // Group history by track and count plays for "Most Played" sort
  const getHistoryWithPlayCounts = () => {
    const trackPlayCounts = {};
    
    history.forEach(item => {
      const trackId = item.trackId;
      if (!trackPlayCounts[trackId]) {
        trackPlayCounts[trackId] = {
          ...item,
          playCount: 0,
          lastPlayedAt: item.playedAt,
        };
      }
      trackPlayCounts[trackId].playCount += 1;
      // Keep the most recent playedAt
      if (new Date(item.playedAt) > new Date(trackPlayCounts[trackId].lastPlayedAt)) {
        trackPlayCounts[trackId].lastPlayedAt = item.playedAt;
      }
    });

    return Object.values(trackPlayCounts);
  };

  // Sort history based on selected option
  const getSortedHistory = () => {
    if (sortBy === 'mostPlayed') {
      // For most played, group by track and count plays
      const historyWithCounts = getHistoryWithPlayCounts();
      return historyWithCounts.sort((a, b) => b.playCount - a.playCount);
    } else if (sortBy === 'oldest') {
      return [...history].sort((a, b) => new Date(a.playedAt) - new Date(b.playedAt));
    } else {
      // Default: most recent
      return [...history].sort((a, b) => new Date(b.playedAt) - new Date(a.playedAt));
    }
  };

  const sortedHistory = getSortedHistory();

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <AppLayout>
      <div className="min-h-screen px-8 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${themeConfig.classes.gradient} flex items-center justify-center shadow-lg`}>
                  <Clock className={`w-6 h-6 ${themeConfig.classes.text.primary}`} />
                </div>
                <h1 className={`text-4xl font-light ${themeConfig.classes.text.primary}`}>Listen History</h1>
              </div>
              {history.length > 0 && (
                <button
                  onClick={() => setShowClearDialog(true)}
                  className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-200 rounded-lg border border-red-800/30 hover:border-red-700/50 transition-all flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear History
                </button>
              )}
            </div>
            <p className={`${themeConfig.classes.text.secondary} text-lg font-light`}>Track your musical journey</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className={`${themeConfig.classes.card} backdrop-blur-xl rounded-2xl p-6`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`${themeConfig.classes.text.secondary} text-sm`}>Total Plays</span>
                <Play className={`w-4 h-4 ${themeConfig.classes.accent}`} />
              </div>
              <p className={`text-3xl font-light ${themeConfig.classes.text.primary}`}>
                {loading ? '...' : stats.totalPlays}
              </p>
            </div>

            <div className={`${themeConfig.classes.card} backdrop-blur-xl rounded-2xl p-6`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`${themeConfig.classes.text.secondary} text-sm`}>Unique Tracks</span>
                <TrendingUp className={`w-4 h-4 ${themeConfig.classes.accent}`} />
              </div>
              <p className={`text-3xl font-light ${themeConfig.classes.text.primary}`}>
                {loading ? '...' : stats.uniqueTracks}
              </p>
            </div>

            <div className={`${themeConfig.classes.card} backdrop-blur-xl rounded-2xl p-6`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`${themeConfig.classes.text.secondary} text-sm`}>This Week</span>
                <Calendar className={`w-4 h-4 ${themeConfig.classes.accent}`} />
              </div>
              <p className={`text-3xl font-light ${themeConfig.classes.text.primary}`}>
                {loading ? '...' : stats.playsThisWeek}
              </p>
            </div>
          </div>

          {/* Sort Options */}
          <div className={`${themeConfig.classes.card} backdrop-blur-xl rounded-2xl p-4 mb-6`}>
            <div className="flex items-center gap-4">
              <span className={`${themeConfig.classes.text.secondary} text-sm font-medium`}>Sort by:</span>
              <div className="flex gap-2">
                {[
                  { value: 'recent', label: 'Most Recent' },
                  { value: 'mostPlayed', label: 'Most Played' },
                  { value: 'oldest', label: 'Oldest First' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      sortBy === option.value
                        ? themeConfig.classes.button.primary
                        : themeConfig.classes.button.secondary
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <div className={`w-16 h-16 border-4 ${themeConfig.classes.card} border-t-current rounded-full animate-spin mx-auto mb-4 ${themeConfig.classes.accent}`}></div>
              <p className={themeConfig.classes.text.secondary}>Loading history...</p>
            </div>
          )}

          {/* History List */}
          {!loading && sortedHistory.length > 0 && (
            <div className="space-y-3">
              {sortedHistory.map((item, index) => (
                <div
                  key={item.id}
                  className={`${themeConfig.classes.card} backdrop-blur-xl rounded-xl p-5 hover:shadow-xl transition-all group`}
                >
                  <div className="flex items-center gap-4">
                    {/* Track Number */}
                    <div className="w-8 text-center">
                      <span className={`${themeConfig.classes.text.secondary} text-sm font-medium`}>{index + 1}</span>
                    </div>

                    {/* Track Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`${themeConfig.classes.text.primary} font-medium mb-1 truncate group-hover:${themeConfig.classes.accent} transition-colors`}>
                        {item.track?.songName || 'Unknown Track'}
                      </h3>
                      <div className={`flex items-center gap-3 text-sm ${themeConfig.classes.text.secondary}`}>
                        <span className="truncate">{item.track?.artist || 'Unknown Artist'}</span>
                        {item.track?.album && (
                          <>
                            <span className={themeConfig.classes.accent}>•</span>
                            <span className="truncate">{item.track.album}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Playlist Badge */}
                    {item.playlist && (
                      <div className="hidden md:block">
                        <span className={`px-3 py-1 ${themeConfig.classes.button.secondary} text-xs rounded-full`}>
                          {item.playlist.name}
                        </span>
                      </div>
                    )}

                    {/* Play Count (only for Most Played view) */}
                    {sortBy === 'mostPlayed' && item.playCount && (
                      <div className={`flex items-center gap-2 ${themeConfig.classes.text.secondary}`}>
                        <Play className={`w-4 h-4 ${themeConfig.classes.accent}`} />
                        <span className="text-sm font-medium">{item.playCount} plays</span>
                      </div>
                    )}

                    {/* Duration */}
                    {item.track?.duration && (
                      <div className={`hidden sm:block ${themeConfig.classes.text.secondary} text-sm w-16 text-right`}>
                        {item.track.duration}
                      </div>
                    )}

                    {/* Time Ago */}
                    <div className={`hidden lg:block ${themeConfig.classes.text.secondary} text-sm w-32 text-right`}>
                      {formatDate(sortBy === 'mostPlayed' ? item.lastPlayedAt : item.playedAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && sortedHistory.length === 0 && (
            <div className="text-center py-20">
              <div className={`w-20 h-20 rounded-full ${themeConfig.classes.card} backdrop-blur-xl flex items-center justify-center mx-auto mb-6`}>
                <Clock className={`w-10 h-10 ${themeConfig.classes.accent}`} />
              </div>
              <h3 className={`text-2xl font-light ${themeConfig.classes.text.primary} mb-2`}>No listening history yet</h3>
              <p className={`${themeConfig.classes.text.secondary} mb-6`}>Start playing some tracks to see your history here</p>
            </div>
          )}

          {/* Clear History Confirmation Dialog */}
          <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear Listen History?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your listening history. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearHistory}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Clear History
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </AppLayout>
  );
};

export default History;
