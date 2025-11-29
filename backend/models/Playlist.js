const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    coverImage: {
      type: String,
      default: null, // URL path to uploaded image
    },
    // Sharing and Collaboration fields
    isPublic: {
      type: Boolean,
      default: false, // Private by default
    },
    shareToken: {
      type: String,
      default: null, // Unique token for sharing
      unique: true,
      sparse: true, // Allow multiple null values
    },
    isCollaborative: {
      type: Boolean,
      default: false, // Not collaborative by default
    },
    collaborators: {
      type: [String], // Array of user IDs (prepared for future auth)
      default: [],
    },
    originalPlaylistId: {
      type: String,
      default: null, // Reference to original playlist if this is a copy
    },
    createdBy: {
      type: String,
      required: true, // User ID who created this playlist
      index: true,
    },
    isAdminCreated: {
      type: Boolean,
      default: false, // Quick flag to identify admin-created playlists
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
    collection: 'playlists',
    versionKey: false,
  }
);

// Update the updatedAt timestamp before saving
playlistSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Playlist', playlistSchema);
