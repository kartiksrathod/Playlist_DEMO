const mongoose = require('mongoose');

const userSettingsSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: 'default-user', // Single user for now
    },
    volume: {
      type: Number,
      default: 75,
      min: 0,
      max: 100,
    },
    autoPlay: {
      type: Boolean,
      default: true,
    },
    autoShuffle: {
      type: Boolean,
      default: false,
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
    crossfade: {
      type: Boolean,
      default: false,
    },
    quality: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'high',
    },
    notifications: {
      type: Boolean,
      default: true,
    },
    theme: {
      type: String,
      enum: ['dark', 'light', 'glass', 'vibrant', 'neon', 'retro', 'mesh', 'premium'],
      default: 'dark',
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const UserSettings = mongoose.model('UserSettings', userSettingsSchema);

module.exports = UserSettings;
