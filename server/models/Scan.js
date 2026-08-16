const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['safe', 'suspicious', 'phishing', 'pending', 'failed']
  },
  type: {
    type: String,
    default: 'url'
  },
  details: {
    type: Object
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow anonymous scans if needed, or enforce if auth is strictly required for everything
  }
}, {
  timestamps: true
});

const Scan = mongoose.model('Scan', scanSchema);
module.exports = Scan;
