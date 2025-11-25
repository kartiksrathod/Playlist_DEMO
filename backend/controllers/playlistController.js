const Playlist = require('../models/Playlist');
const Track = require('../models/Track');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

// @desc    Get all playlists
// @route   GET /api/playlists
// @access  Public
const getAllPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find()
      .select('-_id')
      .sort({ createdAt: -1 });

    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single playlist by ID
// @route   GET /api/playlists/:id
// @access  Public
const getPlaylistById = async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ id: req.params.id })
      .select('-_id');

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new playlist
// @route   POST /api/playlists
// @access  Public
const createPlaylist = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Playlist name is required' });
    }

    // Handle cover image if uploaded
    let coverImagePath = null;
    if (req.file) {
      coverImagePath = `/api/uploads/covers/${req.file.filename}`;
    }

    const playlist = new Playlist({
      id: uuidv4(),
      name: name.trim(),
      description: description ? description.trim() : '',
      coverImage: coverImagePath,
    });

    const savedPlaylist = await playlist.save();

    const response = {
      id: savedPlaylist.id,
      name: savedPlaylist.name,
      description: savedPlaylist.description,
      coverImage: savedPlaylist.coverImage,
      createdAt: savedPlaylist.createdAt,
      updatedAt: savedPlaylist.updatedAt,
    };

    res.status(201).json(response);
  } catch (error) {
    // If there was an error and a file was uploaded, delete it
    if (req.file) {
      const filePath = path.join(__dirname, '../uploads/covers', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update playlist
// @route   PUT /api/playlists/:id
// @access  Public
const updatePlaylist = async (req, res) => {
  try {
    const { name, description } = req.body;
    const playlist = await Playlist.findOne({ id: req.params.id });

    if (!playlist) {
      // Clean up uploaded file if playlist not found
      if (req.file) {
        const filePath = path.join(__dirname, '../uploads/covers', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // Update fields
    if (name !== undefined) {
      if (name.trim() === '') {
        return res.status(400).json({ message: 'Playlist name cannot be empty' });
      }
      playlist.name = name.trim();
    }

    if (description !== undefined) {
      playlist.description = description.trim();
    }

    // Handle cover image update
    if (req.file) {
      // Delete old cover image if exists
      if (playlist.coverImage) {
        // Remove /api prefix for filesystem path
        const imagePath = playlist.coverImage.replace('/api/uploads', '/uploads');
        const oldImagePath = path.join(__dirname, '..', imagePath);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      playlist.coverImage = `/api/uploads/covers/${req.file.filename}`;
    }

    playlist.updatedAt = Date.now();
    const updatedPlaylist = await playlist.save();

    const response = {
      id: updatedPlaylist.id,
      name: updatedPlaylist.name,
      description: updatedPlaylist.description,
      coverImage: updatedPlaylist.coverImage,
      createdAt: updatedPlaylist.createdAt,
      updatedAt: updatedPlaylist.updatedAt,
    };

    res.json(response);
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) {
      const filePath = path.join(__dirname, '../uploads/covers', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete playlist
// @route   DELETE /api/playlists/:id
// @access  Public
const deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ id: req.params.id });

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // Delete all tracks associated with this playlist
    const tracks = await Track.find({ playlistId: req.params.id });
    for (const track of tracks) {
      // Delete audio file if exists
      if (track.audioFile) {
        const audioPath = track.audioFile.replace('/api/uploads', '/uploads');
        const audioFullPath = path.join(__dirname, '..', audioPath);
        if (fs.existsSync(audioFullPath)) {
          fs.unlinkSync(audioFullPath);
        }
      }
    }
    // Delete all tracks from database
    await Track.deleteMany({ playlistId: req.params.id });

    // Delete cover image if exists
    if (playlist.coverImage) {
      // Remove /api prefix for filesystem path
      const imagePath = playlist.coverImage.replace('/api/uploads', '/uploads');
      const imageFullPath = path.join(__dirname, '..', imagePath);
      if (fs.existsSync(imageFullPath)) {
        fs.unlinkSync(imageFullPath);
      }
    }

    await Playlist.deleteOne({ id: req.params.id });

    res.json({ message: 'Playlist and associated tracks deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
};
