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
