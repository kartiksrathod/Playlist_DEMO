const express = require('express');
const router = express.Router();
const {
  getRoot,
  createStatusCheck,
  getStatusChecks,
} = require('../controllers/statusController');

// Root route
router.get('/', getRoot);

// Status routes
router.post('/status', createStatusCheck);
router.get('/status', getStatusChecks);

module.exports = router;
