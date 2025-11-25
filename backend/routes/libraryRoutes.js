const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/libraryController');

// Get all tracks from all playlists with search, filter, and sort
router.get('/tracks', libraryController.getAllTracks);

// Get unique artists
router.get('/artists', libraryController.getArtists);

// Get unique albums
router.get('/albums', libraryController.getAlbums);

// Get library statistics
router.get('/stats', libraryController.getLibraryStats);

// Get single track details with related tracks
router.get('/tracks/:trackId', libraryController.getTrackDetails);

module.exports = router;
