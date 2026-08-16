const mongoose = require('mongoose');

const statSchema = new mongoose.Schema({
  totalScans: { type: Number, default: 0 },
  safeScans: { type: Number, default: 0 },
  phishingScans: { type: Number, default: 0 },
  suspiciousScans: { type: Number, default: 0 },
  activeUsers: { type: Number, default: 0 },
  systemHealth: { type: Number, default: 100 }
}, {
  timestamps: true
});

const Stat = mongoose.model('Stat', statSchema);
module.exports = Stat;
