const express = require('express');
const router = express.Router();
const {
  getRoot,
  createStatusCheck,
  getStatusChecks,
} = require('../controllers/statusController');

// Root route
router.get('/', getRoot);

// Health check route (accessible via /api/health)
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Status routes
router.post('/status', createStatusCheck);
router.get('/status', getStatusChecks);

module.exports = router;
