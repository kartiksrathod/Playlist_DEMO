const mongoose = require('mongoose');

const statusCheckSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    client_name: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'status_checks',
    versionKey: false,
  }
);

module.exports = mongoose.model('StatusCheck', statusCheckSchema);
