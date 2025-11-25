const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams to access playlistId from parent route
const audioUpload = require('../middleware/audioUpload');
const {
  getAllTracks,
  getTrackById,
  createTrack,
  updateTrack,
  deleteTrack,
} = require('../controllers/trackController');

// GET all tracks in a playlist
router.get('/', getAllTracks);

// GET single track by ID
router.get('/:trackId', getTrackById);

// CREATE new track (with optional audio file)
router.post('/', audioUpload.single('audioFile'), createTrack);

// UPDATE track (with optional new audio file)
router.put('/:trackId', audioUpload.single('audioFile'), updateTrack);

// DELETE track
router.delete('/:trackId', deleteTrack);

module.exports = router;
