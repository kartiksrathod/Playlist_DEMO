const Track = require('../models/Track');
const Playlist = require('../models/Playlist');

/**
 * Get all tracks from all playlists with enriched data
 * Supports search, filtering, and sorting
 */
const getAllTracks = async (req, res) => {
  try {
    const {
      search = '',
      playlist = '',
      artist = '',
      album = '',
      type = '', // 'url' or 'file'
      sortBy = 'recent', // 'recent', 'name-asc', 'name-desc', 'duration-asc', 'duration-desc'
    } = req.query;

    // Build filter query
    let filter = {};

    // Search across multiple fields
    if (search) {
      filter.$or = [
        { songName: { $regex: search, $options: 'i' } },
        { artist: { $regex: search, $options: 'i' } },
        { album: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by playlist
    if (playlist) {
      filter.playlistId = playlist;
    }

    // Filter by artist
    if (artist) {
      filter.artist = { $regex: artist, $options: 'i' };
    }

    // Filter by album
    if (album) {
      filter.album = { $regex: album, $options: 'i' };
    }

    // Filter by type (URL vs uploaded file)
    if (type === 'url') {
      filter.audioUrl = { $ne: '' };
    } else if (type === 'file') {
      filter.audioFile = { $ne: null };
    }

    // Get all tracks with filters
    let query = Track.find(filter).select('-_id');

    // Apply sorting
    switch (sortBy) {
      case 'name-asc':
        query = query.sort({ songName: 1 });
        break;
      case 'name-desc':
        query = query.sort({ songName: -1 });
        break;
      case 'duration-asc':
        query = query.sort({ duration: 1 });
        break;
      case 'duration-desc':
        query = query.sort({ duration: -1 });
        break;
      case 'recent':
      default:
        query = query.sort({ createdAt: -1 });
        break;
    }

    const tracks = await query;

    // Enrich tracks with playlist information
    const enrichedTracks = await Promise.all(
      tracks.map(async (track) => {
        const playlist = await Playlist.findOne({ id: track.playlistId }).select('-_id');
        return {
          ...track.toObject(),
          playlistName: playlist?.name || 'Unknown Playlist',
          playlistCover: playlist?.coverImage || null,
        };
      })
    );

    res.json({
      success: true,
      count: enrichedTracks.length,
      tracks: enrichedTracks,
    });
  } catch (error) {
    console.error('Error fetching library tracks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch library tracks',
      error: error.message,
    });
  }
};

/**
 * Get unique artists from all tracks
 */
const getArtists = async (req, res) => {
  try {
    const artists = await Track.distinct('artist', { artist: { $ne: '' } });
    res.json({
      success: true,
      artists: artists.sort(),
    });
  } catch (error) {
    console.error('Error fetching artists:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch artists',
      error: error.message,
    });
  }
};

/**
 * Get unique albums from all tracks
 */
const getAlbums = async (req, res) => {
  try {
    const albums = await Track.distinct('album', { album: { $ne: '' } });
    res.json({
      success: true,
      albums: albums.sort(),
    });
  } catch (error) {
    console.error('Error fetching albums:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch albums',
      error: error.message,
    });
  }
};

/**
 * Get single track details with playlist info and related tracks
 */
const getTrackDetails = async (req, res) => {
  try {
    const { trackId } = req.params;

    // Get the track
    const track = await Track.findOne({ id: trackId }).select('-_id');
    if (!track) {
      return res.status(404).json({
        success: false,
        message: 'Track not found',
      });
    }

    // Get playlist info
    const playlist = await Playlist.findOne({ id: track.playlistId }).select('-_id');

    // Get all playlists containing this track (in case it's in multiple)
    const allTracksWithSameName = await Track.find({ songName: track.songName }).select('playlistId -_id');
    const playlistIds = [...new Set(allTracksWithSameName.map(t => t.playlistId))];
    const playlists = await Playlist.find({ id: { $in: playlistIds } }).select('-_id');

    // Get related tracks from same artist
    let relatedByArtist = [];
    if (track.artist) {
      relatedByArtist = await Track.find({
        artist: track.artist,
        id: { $ne: trackId },
      })
        .limit(5)
        .select('-_id');
    }

    // Get related tracks from same album
    let relatedByAlbum = [];
    if (track.album) {
      relatedByAlbum = await Track.find({
        album: track.album,
        id: { $ne: trackId },
      })
        .limit(5)
        .select('-_id');
    }

    // Enrich related tracks with playlist info
    const enrichRelated = async (tracks) => {
      return await Promise.all(
        tracks.map(async (t) => {
          const pl = await Playlist.findOne({ id: t.playlistId }).select('-_id');
          return {
            ...t.toObject(),
            playlistName: pl?.name || 'Unknown Playlist',
            playlistCover: pl?.coverImage || null,
          };
        })
      );
    };

    const enrichedRelatedByArtist = await enrichRelated(relatedByArtist);
    const enrichedRelatedByAlbum = await enrichRelated(relatedByAlbum);

    res.json({
      success: true,
      track: {
        ...track.toObject(),
        playlistName: playlist?.name || 'Unknown Playlist',
        playlistCover: playlist?.coverImage || null,
      },
      foundInPlaylists: playlists,
      relatedTracks: {
        byArtist: enrichedRelatedByArtist,
        byAlbum: enrichedRelatedByAlbum,
      },
    });
  } catch (error) {
    console.error('Error fetching track details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch track details',
      error: error.message,
    });
  }
};

/**
 * Get library statistics
 */
const getLibraryStats = async (req, res) => {
  try {
    const totalTracks = await Track.countDocuments();
    const totalPlaylists = await Playlist.countDocuments();
    const uniqueArtists = await Track.distinct('artist', { artist: { $ne: '' } });
    const uniqueAlbums = await Track.distinct('album', { album: { $ne: '' } });
    
    // Count tracks with uploaded files vs URLs
    const tracksWithFiles = await Track.countDocuments({ audioFile: { $ne: null } });
    const tracksWithUrls = await Track.countDocuments({ audioUrl: { $ne: '' } });

    res.json({
      success: true,
      stats: {
        totalTracks,
        totalPlaylists,
        uniqueArtists: uniqueArtists.length,
        uniqueAlbums: uniqueAlbums.length,
        tracksWithFiles,
        tracksWithUrls,
      },
    });
  } catch (error) {
    console.error('Error fetching library stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch library stats',
      error: error.message,
    });
  }
};

module.exports = {
  getAllTracks,
  getArtists,
  getAlbums,
  getTrackDetails,
  getLibraryStats,
};
