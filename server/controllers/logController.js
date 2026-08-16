const Log = require('../models/Log');

// @desc    Get all logs
// @route   GET /api/logs
// @access  Private
const getLogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 500;
    const logs = await Log.find().sort({ createdAt: -1 }).limit(limit).populate('user', 'name email');
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a log
// @route   POST /api/logs
// @access  Private (or public depending on where logs come from)
const createLog = async (req, res) => {
  try {
    const { action, level, message, details } = req.body;
    const logData = { action, level, message, details };
    
    if (req.user) {
      logData.user = req.user._id;
    }

    const log = await Log.create(logData);
    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getLogs,
  createLog,
};
