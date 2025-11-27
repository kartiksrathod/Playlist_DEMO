const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const favoriteSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => uuidv4(),
    unique: true,
    required: true
  },
  userId: {
    type: String,
    default: 'default-user', // Single user app
    required: true
  },
  itemType: {
    type: String,
    enum: ['playlist', 'track'],
    required: true
  },
  itemId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'favorites',
  versionKey: false
});

// Compound index to ensure uniqueness per user, type, and item
favoriteSchema.index({ userId: 1, itemType: 1, itemId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);