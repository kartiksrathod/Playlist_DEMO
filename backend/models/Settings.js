const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const settingsSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => uuidv4(),
      unique: true,
      required: true,
    },
    userId: {
      type: String,
      default: 'default', // For now, use default user since we don't have auth
      required: true,
    },
    volume: {
      type: Number,
      default: 70,
      min: 0,
      max: 100,
    },
    shuffle: {
      type: Boolean,
      default: false,
    },
    repeat: {
      type: String,
      enum: ['off', 'one', 'all'],
      default: 'off',
    },
    autoPlay: {
      type: Boolean,
      default: true,
    },
    theme: {
      type: String,
      enum: ['dark', 'light'],
      default: 'dark',
    },
    lastPlayedTrackId: {
      type: String,
      default: null,
    },
    lastPlayedPlaylistId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'settings',
  }
);

// Ensure only one settings document per user
settingsSchema.index({ userId: 1 }, { unique: true });

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
