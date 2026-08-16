const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['info', 'warning', 'error'],
    default: 'info'
  },
  message: {
    type: String
  },
  details: {
    type: Object
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Log = mongoose.model('Log', logSchema);
module.exports = Log;
