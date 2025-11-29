const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { auth, optionalAuth } = require('../middleware/auth');
const {
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
} = require('../controllers/playlistController');

// Public routes (no auth required)
// GET all public playlists (must be before /:id to avoid conflict)
router.get('/public', getPublicPlaylists);

// GET playlist by share token
router.get('/shared/:token', getPlaylistByShareToken);

// Protected routes (auth required)
// GET all playlists (filtered by user role)
router.get('/', auth, getAllPlaylists);

// GET single playlist by ID
router.get('/:id', auth, getPlaylistById);

// CREATE new playlist (with optional cover image)
router.post('/', auth, upload.single('coverImage'), createPlaylist);

// UPDATE playlist (with optional new cover image)
router.put('/:id', auth, upload.single('coverImage'), updatePlaylist);

// DELETE playlist
router.delete('/:id', auth, deletePlaylist);

// POST import shared playlist
router.post('/import/:token', auth, importSharedPlaylist);

// POST generate share link for playlist
router.post('/:id/share', auth, generateShareLink);

// PUT toggle public/private
router.put('/:id/toggle-public', auth, togglePublic);

// PUT toggle collaborative mode
router.put('/:id/toggle-collaborative', auth, toggleCollaborative);

module.exports = router;
