const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');

// GET /api/settings - Get user settings
router.get('/', settingsController.getSettings);

// PUT /api/settings - Update user settings
router.put('/', settingsController.updateSettings);

// POST /api/settings/reset - Reset settings to default
router.post('/reset', settingsController.resetSettings);

module.exports = router;
