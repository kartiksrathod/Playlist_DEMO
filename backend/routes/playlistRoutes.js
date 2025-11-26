const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
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

// GET all public playlists (must be before /:id to avoid conflict)
router.get('/public', getPublicPlaylists);

// GET playlist by share token
router.get('/shared/:token', getPlaylistByShareToken);

// POST import shared playlist
router.post('/import/:token', importSharedPlaylist);

// GET all playlists
router.get('/', getAllPlaylists);

// GET single playlist by ID
router.get('/:id', getPlaylistById);

// CREATE new playlist (with optional cover image)
router.post('/', upload.single('coverImage'), createPlaylist);

// UPDATE playlist (with optional new cover image)
router.put('/:id', upload.single('coverImage'), updatePlaylist);

// DELETE playlist
router.delete('/:id', deletePlaylist);

// POST generate share link for playlist
router.post('/:id/share', generateShareLink);

// PUT toggle public/private
router.put('/:id/toggle-public', togglePublic);

// PUT toggle collaborative mode
router.put('/:id/toggle-collaborative', toggleCollaborative);

module.exports = router;
