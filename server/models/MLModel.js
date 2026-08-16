const mongoose = require('mongoose');

const mlModelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  version: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'training', 'deprecated'],
    default: 'active'
  },
  accuracy: {
    type: Number,
    default: 0
  },
  lastTrained: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const MLModel = mongoose.model('MLModel', mlModelSchema);
module.exports = MLModel;
