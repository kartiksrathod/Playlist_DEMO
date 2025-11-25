const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  getAllPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
} = require('../controllers/playlistController');

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

module.exports = router;
