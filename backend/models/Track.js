const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    playlistId: {
      type: String,
      required: true,
      index: true,
    },
    songName: {
      type: String,
      required: true,
      trim: true,
    },
    artist: {
      type: String,
      default: '',
      trim: true,
    },
    album: {
      type: String,
      default: '',
      trim: true,
    },
    duration: {
      type: String, // Format: "3:45" or "2:30"
      default: '',
      trim: true,
    },
    audioUrl: {
      type: String, // External audio URL (YouTube, Spotify, etc.)
      default: '',
      trim: true,
    },
    audioFile: {
      type: String, // Path to uploaded audio file
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'tracks',
    versionKey: false,
  }
);

// Update the updatedAt timestamp before saving
trackSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Track', trackSchema);
