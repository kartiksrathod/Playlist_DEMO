const StatusCheck = require('../models/StatusCheck');
const { v4: uuidv4 } = require('uuid');

// @desc    Get root message
// @route   GET /api/
// @access  Public
const getRoot = async (req, res) => {
  try {
    res.json({ message: 'Hello World' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new status check
// @route   POST /api/status
// @access  Public
const createStatusCheck = async (req, res) => {
  try {
    const { client_name } = req.body;

    if (!client_name) {
      return res.status(400).json({ message: 'client_name is required' });
    }

    const statusCheck = new StatusCheck({
      id: uuidv4(),
      client_name,
      timestamp: new Date(),
    });

    const savedStatusCheck = await statusCheck.save();
    
    // Return without MongoDB _id field
    const response = {
      id: savedStatusCheck.id,
      client_name: savedStatusCheck.client_name,
      timestamp: savedStatusCheck.timestamp,
    };

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all status checks
// @route   GET /api/status
// @access  Public
const getStatusChecks = async (req, res) => {
  try {
    const statusChecks = await StatusCheck.find()
      .select('-_id id client_name timestamp')
      .sort({ timestamp: -1 })
      .limit(1000);

    res.json(statusChecks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRoot,
  createStatusCheck,
  getStatusChecks,
};
