const Stat = require('../models/Stat');

// @desc    Get current stats
// @route   GET /api/stats
// @access  Public
const getStats = async (req, res) => {
  try {
    let stat = await Stat.findOne().sort({ createdAt: -1 });
    if (!stat) {
      // If no stats exist, create a default one
      stat = await Stat.create({});
    }
    res.status(200).json(stat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update stats
// @route   PUT /api/stats
// @access  Private
const updateStats = async (req, res) => {
  try {
    let stat = await Stat.findOne().sort({ createdAt: -1 });
    
    if (stat) {
      Object.assign(stat, req.body);
      await stat.save();
      res.status(200).json(stat);
    } else {
      stat = await Stat.create(req.body);
      res.status(201).json(stat);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getStats,
  updateStats,
};
