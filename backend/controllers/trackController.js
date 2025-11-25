const Track = require('../models/Track');
const Playlist = require('../models/Playlist');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

// @desc    Get all tracks in a playlist
// @route   GET /api/playlists/:playlistId/tracks
// @access  Public
const getAllTracks = async (req, res) => {
  try {
    const { playlistId } = req.params;

    // Verify playlist exists
    const playlist = await Playlist.findOne({ id: playlistId });
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    const tracks = await Track.find({ playlistId })
      .select('-_id')
      .sort({ createdAt: 1 });

    res.json(tracks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single track by ID
// @route   GET /api/playlists/:playlistId/tracks/:trackId
// @access  Public
const getTrackById = async (req, res) => {
  try {
    const { playlistId, trackId } = req.params;

    const track = await Track.findOne({ id: trackId, playlistId })
      .select('-_id');

    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }

    res.json(track);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new track in playlist
// @route   POST /api/playlists/:playlistId/tracks
// @access  Public
const createTrack = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { songName, artist, album, duration, audioUrl } = req.body;

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
// @access  Public
const updateTrack = async (req, res) => {
  try {
    const { playlistId, trackId } = req.params;
    const { songName, artist, album, duration, audioUrl } = req.body;

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

    // Update fields
    if (songName !== undefined) {
      if (songName.trim() === '') {
        // Clean up uploaded file if validation fails
        if (req.file) {
          const filePath = path.join(__dirname, '../uploads/audio', req.file.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
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
        // Remove /api prefix for filesystem path
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
// @access  Public
const deleteTrack = async (req, res) => {
  try {
    const { playlistId, trackId } = req.params;

    const track = await Track.findOne({ id: trackId, playlistId });

    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }

    await Track.deleteOne({ id: trackId, playlistId });

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
