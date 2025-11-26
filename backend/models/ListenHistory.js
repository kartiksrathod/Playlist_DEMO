const mongoose = require('mongoose');

const listenHistorySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    trackId: {
      type: String,
      required: true,
      index: true,
    },
    playlistId: {
      type: String,
      default: null,
    },
    playedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    duration: {
      type: Number, // Duration listened in seconds
      default: 0,
    },
    completed: {
      type: Boolean, // Whether track was played to completion
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
listenHistorySchema.index({ trackId: 1, playedAt: -1 });

const ListenHistory = mongoose.model('ListenHistory', listenHistorySchema);

module.exports = ListenHistory;
