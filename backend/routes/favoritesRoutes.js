const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController');

// Playlist favorites
router.post('/playlists/:playlistId', favoritesController.addPlaylistToFavorites);
router.delete('/playlists/:playlistId', favoritesController.removePlaylistFromFavorites);

// Track favorites
router.post('/tracks/:trackId', favoritesController.addTrackToFavorites);
router.delete('/tracks/:trackId', favoritesController.removeTrackFromFavorites);

// Get favorites
router.get('/playlists', favoritesController.getFavoritePlaylists);
router.get('/tracks', favoritesController.getFavoriteTracks);
router.get('/all', favoritesController.getAllFavorites);

// Check if item is favorited
router.get('/check/:type/:id', favoritesController.checkFavorite);

module.exports = router;