const Track = require('../models/Track');
const Playlist = require('../models/Playlist');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

// @desc    Get all tracks in a playlist
// @route   GET /api/playlists/:playlistId/tracks
// @access  Private (requires authentication)
const getAllTracks = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const userId = req.userId;
    const isAdmin = req.isAdmin;

    // Verify playlist exists
    const playlist = await Playlist.findOne({ id: playlistId });
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // Check access: Users can only see tracks in playlists they can access
    if (!isAdmin && !playlist.isAdminCreated && playlist.createdBy !== userId) {
      return res.status(403).json({ message: 'You do not have permission to view this playlist' });
    }

    let query = { playlistId };
    
    // Filter tracks based on role
    if (!isAdmin) {
      // Users see only admin-created tracks + their own in this playlist
      query = {
        playlistId,
        $or: [
          { isAdminCreated: true },
          { createdBy: userId }
        ]
      };
    }

    const tracks = await Track.find(query)
      .select('-_id')
      .sort({ createdAt: 1 });

    res.json(tracks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single track by ID
// @route   GET /api/playlists/:playlistId/tracks/:trackId
// @access  Private (requires authentication)
const getTrackById = async (req, res) => {
  try {
    const { playlistId, trackId } = req.params;
    const userId = req.userId;
    const isAdmin = req.isAdmin;

    const track = await Track.findOne({ id: trackId, playlistId })
      .select('-_id');

    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }

    // Check access
    if (!isAdmin && !track.isAdminCreated && track.createdBy !== userId) {
      return res.status(403).json({ message: 'You do not have permission to view this track' });
    }

    res.json(track);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new track in playlist
// @route   POST /api/playlists/:playlistId/tracks
// @access  Private (requires authentication)
const createTrack = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { songName, artist, album, duration, audioUrl } = req.body;
    const userId = req.userId;
    const isAdmin = req.isAdmin;

    // Verify playlist exists
    const playlist = await Playlist.findOne({ id: playlistId });
    if (!playlist) {
      // Clean up uploaded file if playlist not found
      if (req.file) {
        const filePath = path.join(__dirname, '../uploads/audio', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // Check if user can add tracks to this playlist
    if (!isAdmin && !playlist.isAdminCreated && playlist.createdBy !== userId) {
      // Clean up uploaded file
      if (req.file) {
        const filePath = path.join(__dirname, '../uploads/audio', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      return res.status(403).json({ message: 'You do not have permission to add tracks to this playlist' });
    }

    if (!songName || songName.trim() === '') {
      // Clean up uploaded file if validation fails
      if (req.file) {
        const filePath = path.join(__dirname, '../uploads/audio', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      return res.status(400).json({ message: 'Song name is required' });
    }

    // Handle audio file if uploaded
    let audioFilePath = null;
    if (req.file) {
      audioFilePath = `/api/uploads/audio/${req.file.filename}`;
    }

    const track = new Track({
      id: uuidv4(),
      playlistId,
      songName: songName.trim(),
      artist: artist ? artist.trim() : '',
      album: album ? album.trim() : '',
      duration: duration ? duration.trim() : '',
      audioUrl: audioUrl ? audioUrl.trim() : '',
      audioFile: audioFilePath,
      createdBy: userId,
      isAdminCreated: isAdmin,
    });

    const savedTrack = await track.save();

    const response = {
      id: savedTrack.id,
      playlistId: savedTrack.playlistId,
      songName: savedTrack.songName,
      artist: savedTrack.artist,
      album: savedTrack.album,
      duration: savedTrack.duration,
      audioUrl: savedTrack.audioUrl,
      audioFile: savedTrack.audioFile,
      createdBy: savedTrack.createdBy,
      isAdminCreated: savedTrack.isAdminCreated,
      createdAt: savedTrack.createdAt,
      updatedAt: savedTrack.updatedAt,
    };

    res.status(201).json(response);
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) {
      const filePath = path.join(__dirname, '../uploads/audio', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update track
// @route   PUT /api/playlists/:playlistId/tracks/:trackId
// @access  Private (requires authentication)
const updateTrack = async (req, res) => {
  try {
    const { playlistId, trackId } = req.params;
    const { songName, artist, album, duration, audioUrl } = req.body;
    const userId = req.userId;
    const isAdmin = req.isAdmin;

    const track = await Track.findOne({ id: trackId, playlistId });

    if (!track) {
      // Clean up uploaded file if track not found
      if (req.file) {
        const filePath = path.join(__dirname, '../uploads/audio', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      return res.status(404).json({ message: 'Track not found' });
    }

    // Check ownership: Users can only edit their own tracks, admins can edit anything
    if (!isAdmin && track.createdBy !== userId) {
      // Clean up uploaded file
      if (req.file) {
        const filePath = path.join(__dirname, '../uploads/audio', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      return res.status(403).json({ message: 'You do not have permission to edit this track' });
    }

    // Update fields
    if (songName !== undefined) {
      if (songName.trim() === '') {
        return res.status(400).json({ message: 'Song name cannot be empty' });
      }
      track.songName = songName.trim();
    }

    if (artist !== undefined) {
      track.artist = artist.trim();
    }

    if (album !== undefined) {
      track.album = album.trim();
    }

    if (duration !== undefined) {
      track.duration = duration.trim();
    }

    if (audioUrl !== undefined) {
      track.audioUrl = audioUrl.trim();
    }

    // Handle audio file update
    if (req.file) {
      // Delete old audio file if exists
      if (track.audioFile) {
        const audioPath = track.audioFile.replace('/api/uploads', '/uploads');
        const oldAudioPath = path.join(__dirname, '..', audioPath);
        if (fs.existsSync(oldAudioPath)) {
          fs.unlinkSync(oldAudioPath);
        }
      }
      track.audioFile = `/api/uploads/audio/${req.file.filename}`;
    }

    track.updatedAt = Date.now();
    const updatedTrack = await track.save();

    const response = {
      id: updatedTrack.id,
      playlistId: updatedTrack.playlistId,
      songName: updatedTrack.songName,
      artist: updatedTrack.artist,
      album: updatedTrack.album,
      duration: updatedTrack.duration,
      audioUrl: updatedTrack.audioUrl,
      audioFile: updatedTrack.audioFile,
      createdBy: updatedTrack.createdBy,
      isAdminCreated: updatedTrack.isAdminCreated,
      createdAt: updatedTrack.createdAt,
      updatedAt: updatedTrack.updatedAt,
    };

    res.json(response);
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) {
      const filePath = path.join(__dirname, '../uploads/audio', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete track
// @route   DELETE /api/playlists/:playlistId/tracks/:trackId
// @access  Private (requires authentication)
const deleteTrack = async (req, res) => {
  try {
    const { playlistId, trackId } = req.params;
    const userId = req.userId;
    const isAdmin = req.isAdmin;

    const track = await Track.findOne({ id: trackId, playlistId });

    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }

    // Check ownership: Users can only delete their own tracks, admins can delete anything
    if (!isAdmin && track.createdBy !== userId) {
      return res.status(403).json({ message: 'You do not have permission to delete this track' });
    }

    // Delete audio file if exists
    if (track.audioFile) {
      const audioPath = track.audioFile.replace('/api/uploads', '/uploads');
      const audioFullPath = path.join(__dirname, '..', audioPath);
      if (fs.existsSync(audioFullPath)) {
        fs.unlinkSync(audioFullPath);
      }
    }

    await Track.deleteOne({ id: trackId });

    res.json({ message: 'Track deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllTracks,
  getTrackById,
  createTrack,
  updateTrack,
  deleteTrack,
};
