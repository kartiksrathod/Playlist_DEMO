const { v4: uuidv4 } = require('uuid');
const ListenHistory = require('../models/ListenHistory');
const Track = require('../models/Track');
const Playlist = require('../models/Playlist');

// Record a track play
exports.recordPlay = async (req, res) => {
  try {
    const { trackId, playlistId, duration, completed } = req.body;

    // Validate required fields
    if (!trackId) {
      return res.status(400).json({ error: 'trackId is required' });
    }

    // Verify track exists
    const track = await Track.findOne({ id: trackId });
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }

    // Create listen history entry
    const historyEntry = new ListenHistory({
      id: uuidv4(),
      trackId,
      playlistId: playlistId || null,
      playedAt: new Date(),
      duration: duration || 0,
      completed: completed || false,
    });

    await historyEntry.save();

    res.status(201).json({
      message: 'Play recorded successfully',
      history: {
        id: historyEntry.id,
        trackId: historyEntry.trackId,
        playlistId: historyEntry.playlistId,
        playedAt: historyEntry.playedAt,
        duration: historyEntry.duration,
        completed: historyEntry.completed,
      },
    });
  } catch (error) {
    console.error('Error recording play:', error);
    res.status(500).json({ error: 'Failed to record play' });
  }
};

// Get listening history
exports.getHistory = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    // Get history with track and playlist information
    const history = await ListenHistory.find()
      .sort({ playedAt: -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit));

    // Enrich with track and playlist data
    const enrichedHistory = await Promise.all(
      history.map(async (entry) => {
        const track = await Track.findOne({ id: entry.trackId });
        let playlist = null;
        if (entry.playlistId) {
          playlist = await Playlist.findOne({ id: entry.playlistId });
        }

        return {
          id: entry.id,
          trackId: entry.trackId,
          track: track
            ? {
                id: track.id,
                songName: track.songName,
                artist: track.artist,
                album: track.album,
                duration: track.duration,
                audioUrl: track.audioUrl,
                audioFile: track.audioFile,
              }
            : null,
          playlistId: entry.playlistId,
          playlist: playlist
            ? {
                id: playlist.id,
                name: playlist.name,
                coverImage: playlist.coverImage,
              }
            : null,
          playedAt: entry.playedAt,
          duration: entry.duration,
          completed: entry.completed,
        };
      })
    );

    // Get total count
    const total = await ListenHistory.countDocuments();

    res.json({
      history: enrichedHistory,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: total > parseInt(offset) + enrichedHistory.length,
      },
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

// Get listening stats
exports.getStats = async (req, res) => {
  try {
    const totalPlays = await ListenHistory.countDocuments();
    const completedPlays = await ListenHistory.countDocuments({ completed: true });
    
    // Get unique tracks played
    const uniqueTracks = await ListenHistory.distinct('trackId');
    
    // Get plays in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const playsThisWeek = await ListenHistory.countDocuments({
      playedAt: { $gte: sevenDaysAgo },
    });

    // Get most played tracks (top 10)
    const mostPlayed = await ListenHistory.aggregate([
      {
        $group: {
          _id: '$trackId',
          playCount: { $sum: 1 },
        },
      },
      { $sort: { playCount: -1 } },
      { $limit: 10 },
    ]);

    // Enrich most played with track data
    const enrichedMostPlayed = await Promise.all(
      mostPlayed.map(async (item) => {
        const track = await Track.findOne({ id: item._id });
        return {
          trackId: item._id,
          playCount: item.playCount,
          track: track
            ? {
                id: track.id,
                songName: track.songName,
                artist: track.artist,
                album: track.album,
              }
            : null,
        };
      })
    );

    res.json({
      totalPlays,
      completedPlays,
      uniqueTracks: uniqueTracks.length,
      playsThisWeek,
      mostPlayed: enrichedMostPlayed,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

// Clear history
exports.clearHistory = async (req, res) => {
  try {
    await ListenHistory.deleteMany({});
    res.json({ message: 'History cleared successfully' });
  } catch (error) {
    console.error('Error clearing history:', error);
    res.status(500).json({ error: 'Failed to clear history' });
  }
};
