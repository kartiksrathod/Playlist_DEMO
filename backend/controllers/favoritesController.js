const Favorite = require('../models/Favorite');
const Playlist = require('../models/Playlist');
const Track = require('../models/Track');

const USER_ID = 'default-user';

// Add playlist to favorites
exports.addPlaylistToFavorites = async (req, res) => {
  try {
    const { playlistId } = req.params;

    // Check if playlist exists
    const playlist = await Playlist.findOne({ id: playlistId });
    if (!playlist) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }

    // Check if already favorited
    const existing = await Favorite.findOne({
      userId: USER_ID,
      itemType: 'playlist',
      itemId: playlistId
    });

    if (existing) {
      return res.status(200).json({ success: true, message: 'Already in favorites', favorite: existing });
    }

    // Create favorite
    const favorite = new Favorite({
      userId: USER_ID,
      itemType: 'playlist',
      itemId: playlistId
    });

    await favorite.save();
    res.status(201).json({ success: true, message: 'Added to favorites', favorite });
  } catch (error) {
    console.error('Error adding playlist to favorites:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Remove playlist from favorites
exports.removePlaylistFromFavorites = async (req, res) => {
  try {
    const { playlistId } = req.params;

    const result = await Favorite.findOneAndDelete({
      userId: USER_ID,
      itemType: 'playlist',
      itemId: playlistId
    });

    if (!result) {
      return res.status(404).json({ success: false, message: 'Favorite not found' });
    }

    res.status(200).json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    console.error('Error removing playlist from favorites:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Add track to favorites
exports.addTrackToFavorites = async (req, res) => {
  try {
    const { trackId } = req.params;

    // Check if track exists
    const track = await Track.findOne({ id: trackId });
    if (!track) {
      return res.status(404).json({ success: false, message: 'Track not found' });
    }

    // Check if already favorited
    const existing = await Favorite.findOne({
      userId: USER_ID,
      itemType: 'track',
      itemId: trackId
    });

    if (existing) {
      return res.status(200).json({ success: true, message: 'Already in favorites', favorite: existing });
    }

    // Create favorite
    const favorite = new Favorite({
      userId: USER_ID,
      itemType: 'track',
      itemId: trackId
    });

    await favorite.save();
    res.status(201).json({ success: true, message: 'Added to favorites', favorite });
  } catch (error) {
    console.error('Error adding track to favorites:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Remove track from favorites
exports.removeTrackFromFavorites = async (req, res) => {
  try {
    const { trackId } = req.params;

    const result = await Favorite.findOneAndDelete({
      userId: USER_ID,
      itemType: 'track',
      itemId: trackId
    });

    if (!result) {
      return res.status(404).json({ success: false, message: 'Favorite not found' });
    }

    res.status(200).json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    console.error('Error removing track from favorites:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get favorite playlists
exports.getFavoritePlaylists = async (req, res) => {
  try {
    const favorites = await Favorite.find({
      userId: USER_ID,
      itemType: 'playlist'
    }).sort({ createdAt: -1 });

    // Fetch full playlist details
    const playlistIds = favorites.map(f => f.itemId);
    const playlists = await Playlist.find({ id: { $in: playlistIds } }, { _id: 0 });

    // Enrich with favorite date and track counts
    const enrichedPlaylists = await Promise.all(playlists.map(async (playlist) => {
      const favorite = favorites.find(f => f.itemId === playlist.id);
      const trackCount = await Track.countDocuments({ playlistId: playlist.id });
      
      return {
        ...playlist.toObject(),
        addedToFavoritesAt: favorite.createdAt,
        trackCount
      };
    }));

    res.status(200).json({ success: true, playlists: enrichedPlaylists, count: enrichedPlaylists.length });
  } catch (error) {
    console.error('Error getting favorite playlists:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get favorite tracks
exports.getFavoriteTracks = async (req, res) => {
  try {
    const favorites = await Favorite.find({
      userId: USER_ID,
      itemType: 'track'
    }).sort({ createdAt: -1 });

    // Fetch full track details with playlist info
    const trackIds = favorites.map(f => f.itemId);
    const tracks = await Track.find({ id: { $in: trackIds } }, { _id: 0 });

    // Enrich with playlist information and favorite date
    const enrichedTracks = await Promise.all(tracks.map(async (track) => {
      const playlist = await Playlist.findOne({ id: track.playlistId }, { _id: 0, name: 1, coverImage: 1 });
      const favorite = favorites.find(f => f.itemId === track.id);
      
      return {
        ...track.toObject(),
        playlistName: playlist?.name || 'Unknown',
        playlistCover: playlist?.coverImage,
        addedToFavoritesAt: favorite.createdAt
      };
    }));

    res.status(200).json({ success: true, tracks: enrichedTracks, count: enrichedTracks.length });
  } catch (error) {
    console.error('Error getting favorite tracks:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Check if item is favorited
exports.checkFavorite = async (req, res) => {
  try {
    const { type, id } = req.params;

    if (!['playlist', 'track'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid type' });
    }

    const favorite = await Favorite.findOne({
      userId: USER_ID,
      itemType: type,
      itemId: id
    });

    res.status(200).json({ success: true, isFavorited: !!favorite });
  } catch (error) {
    console.error('Error checking favorite:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all favorites (both playlists and tracks)
exports.getAllFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: USER_ID }).sort({ createdAt: -1 });

    const playlistFavorites = favorites.filter(f => f.itemType === 'playlist');
    const trackFavorites = favorites.filter(f => f.itemType === 'track');

    res.status(200).json({
      success: true,
      favorites: {
        playlists: playlistFavorites.map(f => f.itemId),
        tracks: trackFavorites.map(f => f.itemId)
      },
      counts: {
        playlists: playlistFavorites.length,
        tracks: trackFavorites.length,
        total: favorites.length
      }
    });
  } catch (error) {
    console.error('Error getting all favorites:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};