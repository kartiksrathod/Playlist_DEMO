const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const settingsController = require('../controllers/settingsController');

// All settings routes require authentication
// GET /api/settings - Get user settings
router.get('/', auth, settingsController.getSettings);

// PUT /api/settings - Update user settings
router.put('/', auth, settingsController.updateSettings);

// POST /api/settings/reset - Reset settings to default
router.post('/reset', auth, settingsController.resetSettings);

module.exports = router;
