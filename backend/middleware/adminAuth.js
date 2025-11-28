const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to verify admin role
 * Must be used after the auth middleware
 */
const adminAuth = async (req, res, next) => {
  try {
    // Check if user is authenticated (should be set by auth middleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Fetch user from database to get latest role
    const user = await User.findOne({ id: req.user.id });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required. You do not have permission to access this resource.'
      });
    }

    // User is admin, proceed
    req.admin = user;
    next();
    
  } catch (error) {
    console.error('Admin Auth Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during admin verification'
    });
  }
};

module.exports = adminAuth;
