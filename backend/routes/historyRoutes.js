const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const historyController = require('../controllers/historyController');

// All history routes require authentication
// POST /api/history - Record a track play
router.post('/', auth, historyController.recordPlay);

// GET /api/history - Get listening history
router.get('/', auth, historyController.getHistory);

// GET /api/history/stats - Get listening stats
router.get('/stats', auth, historyController.getStats);

// DELETE /api/history - Clear history
router.delete('/', auth, historyController.clearHistory);

module.exports = router;
