const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');

// POST /api/history - Record a track play
router.post('/', historyController.recordPlay);

// GET /api/history - Get listening history
router.get('/', historyController.getHistory);

// GET /api/history/stats - Get listening stats
router.get('/stats', historyController.getStats);

// DELETE /api/history - Clear history
router.delete('/', historyController.clearHistory);

module.exports = router;
