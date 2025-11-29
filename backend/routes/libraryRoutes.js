const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const libraryController = require('../controllers/libraryController');

// All library routes require authentication
// Get all tracks from all playlists with search, filter, and sort
router.get('/tracks', auth, libraryController.getAllTracks);

// Get unique artists
router.get('/artists', auth, libraryController.getArtists);

// Get unique albums
router.get('/albums', auth, libraryController.getAlbums);

// Get library statistics
router.get('/stats', auth, libraryController.getLibraryStats);

// Get single track details with related tracks
router.get('/tracks/:trackId', auth, libraryController.getTrackDetails);

module.exports = router;
