const Playlist = require('../models/Playlist');
const Track = require('../models/Track');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

// @desc    Get all playlists (filtered by role)
// @route   GET /api/playlists
// @access  Private (requires authentication)
const getAllPlaylists = async (req, res) => {
  try {
    const userId = req.userId;
    const isAdmin = req.isAdmin;
    
    let query = {};
    
    if (isAdmin) {
      // Admin sees ALL playlists
      query = {};
    } else {
      // Users see only admin-created playlists + their own
      query = {
        $or: [
          { isAdminCreated: true },
          { createdBy: userId }
        ]
      };
    }
    
    const playlists = await Playlist.find(query)
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
// @access  Private (requires authentication)
const createPlaylist = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.userId;
    const isAdmin = req.isAdmin;

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
      createdBy: userId,
      isAdminCreated: isAdmin,
    });

    const savedPlaylist = await playlist.save();

    const response = {
      id: savedPlaylist.id,
      name: savedPlaylist.name,
      description: savedPlaylist.description,
      coverImage: savedPlaylist.coverImage,
      createdBy: savedPlaylist.createdBy,
      isAdminCreated: savedPlaylist.isAdminCreated,
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

// @desc    Generate share token for playlist
// @route   POST /api/playlists/:id/share
// @access  Public
const generateShareLink = async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ id: req.params.id });

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // Generate share token if doesn't exist
    if (!playlist.shareToken) {
      playlist.shareToken = uuidv4();
      await playlist.save();
    }

    res.json({
      message: 'Share link generated successfully',
      shareToken: playlist.shareToken,
      shareUrl: `/shared/${playlist.shareToken}`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get playlist by share token
// @route   GET /api/playlists/shared/:token
// @access  Public
const getPlaylistByShareToken = async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ shareToken: req.params.token })
      .select('-_id');

    if (!playlist) {
      return res.status(404).json({ message: 'Shared playlist not found' });
    }

    // Get tracks in the playlist
    const tracks = await Track.find({ playlistId: playlist.id })
      .select('-_id')
      .sort({ createdAt: 1 });

    res.json({
      playlist,
      tracks,
      isShared: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle playlist public/private
// @route   PUT /api/playlists/:id/toggle-public
// @access  Public
const togglePublic = async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ id: req.params.id });

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    playlist.isPublic = !playlist.isPublic;
    await playlist.save();

    res.json({
      message: `Playlist is now ${playlist.isPublic ? 'public' : 'private'}`,
      isPublic: playlist.isPublic,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle playlist collaborative mode
// @route   PUT /api/playlists/:id/toggle-collaborative
// @access  Public
const toggleCollaborative = async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ id: req.params.id });

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    playlist.isCollaborative = !playlist.isCollaborative;
    await playlist.save();

    res.json({
      message: `Collaborative mode is now ${playlist.isCollaborative ? 'enabled' : 'disabled'}`,
      isCollaborative: playlist.isCollaborative,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Import/copy shared playlist
// @route   POST /api/playlists/import/:token
// @access  Public
const importSharedPlaylist = async (req, res) => {
  try {
    const sourcePlaylist = await Playlist.findOne({ shareToken: req.params.token });

    if (!sourcePlaylist) {
      return res.status(404).json({ message: 'Shared playlist not found' });
    }

    // Create new playlist as a copy
    const newPlaylist = new Playlist({
      id: uuidv4(),
      name: `${sourcePlaylist.name} (Copy)`,
      description: sourcePlaylist.description,
      coverImage: sourcePlaylist.coverImage,
      isPublic: false, // Imported playlists are private by default
      isCollaborative: false,
      originalPlaylistId: sourcePlaylist.id,
    });

    await newPlaylist.save();

    // Copy all tracks from source playlist
    const sourceTracks = await Track.find({ playlistId: sourcePlaylist.id });
    
    const newTracks = sourceTracks.map(track => ({
      id: uuidv4(),
      playlistId: newPlaylist.id,
      songName: track.songName,
      artist: track.artist,
      album: track.album,
      duration: track.duration,
      audioUrl: track.audioUrl,
      audioFile: track.audioFile,
    }));

    if (newTracks.length > 0) {
      await Track.insertMany(newTracks);
    }

    res.status(201).json({
      message: 'Playlist imported successfully',
      playlist: {
        id: newPlaylist.id,
        name: newPlaylist.name,
        description: newPlaylist.description,
        coverImage: newPlaylist.coverImage,
        isPublic: newPlaylist.isPublic,
        isCollaborative: newPlaylist.isCollaborative,
        originalPlaylistId: newPlaylist.originalPlaylistId,
        createdAt: newPlaylist.createdAt,
        updatedAt: newPlaylist.updatedAt,
      },
      tracksCount: newTracks.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all public playlists
// @route   GET /api/playlists/public
// @access  Public
const getPublicPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ isPublic: true })
      .select('-_id')
      .sort({ createdAt: -1 });

    res.json(playlists);
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
  generateShareLink,
  getPlaylistByShareToken,
  togglePublic,
  toggleCollaborative,
  importSharedPlaylist,
  getPublicPlaylists,
};
