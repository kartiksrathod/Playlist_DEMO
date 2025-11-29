const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams to access playlistId from parent route
const audioUpload = require('../middleware/audioUpload');
const { auth } = require('../middleware/auth');
const {
  getAllTracks,
  getTrackById,
  createTrack,
  updateTrack,
  deleteTrack,
} = require('../controllers/trackController');

// All track routes require authentication
// GET all tracks in a playlist
router.get('/', auth, getAllTracks);

// GET single track by ID
router.get('/:trackId', auth, getTrackById);

// CREATE new track (with optional audio file)
router.post('/', auth, audioUpload.single('audioFile'), createTrack);

// UPDATE track (with optional new audio file)
router.put('/:trackId', auth, audioUpload.single('audioFile'), updateTrack);

// DELETE track
router.delete('/:trackId', auth, deleteTrack);

module.exports = router;
