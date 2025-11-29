const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const favoritesController = require('../controllers/favoritesController');

// All favorites routes require authentication
// Playlist favorites
router.post('/playlists/:playlistId', auth, favoritesController.addPlaylistToFavorites);
router.delete('/playlists/:playlistId', auth, favoritesController.removePlaylistFromFavorites);

// Track favorites
router.post('/tracks/:trackId', auth, favoritesController.addTrackToFavorites);
router.delete('/tracks/:trackId', auth, favoritesController.removeTrackFromFavorites);

// Get favorites
router.get('/playlists', auth, favoritesController.getFavoritePlaylists);
router.get('/tracks', auth, favoritesController.getFavoriteTracks);
router.get('/all', auth, favoritesController.getAllFavorites);

// Check if item is favorited
router.get('/check/:type/:id', auth, favoritesController.checkFavorite);

module.exports = router;