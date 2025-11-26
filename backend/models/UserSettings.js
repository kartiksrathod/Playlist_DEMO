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
      default: 70,
      min: 0,
      max: 100,
    },
    autoPlay: {
      type: Boolean,
      default: true,
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
