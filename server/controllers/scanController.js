const Scan = require('../models/Scan');

// @desc    Get all scans
// @route   GET /api/scans
// @access  Public (or Private depending on needs)
const getScans = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const scans = await Scan.find().sort({ createdAt: -1 }).limit(limit).populate('user', 'name email');
    res.status(200).json(scans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new scan
// @route   POST /api/scans
// @access  Public
const createScan = async (req, res) => {
  try {
    const { url, status, type, details } = req.body;
    const scanData = {
      url,
      status,
      type,
      details,
    };
    
    // Attach user if available
    if (req.user) {
      scanData.user = req.user._id;
    }

    const scan = await Scan.create(scanData);
    res.status(201).json(scan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a scan
// @route   DELETE /api/scans/:id
// @access  Private
const deleteScan = async (req, res) => {
  try {
    const scan = await Scan.findById(req.params.id);
    if (!scan) {
      return res.status(404).json({ message: 'Scan not found' });
    }
    await scan.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Batch create scans
// @route   POST /api/scans/batch
// @access  Private
const batchCreateScans = async (req, res) => {
  try {
    const { scans } = req.body;
    if (!scans || !Array.isArray(scans)) {
      return res.status(400).json({ message: 'Invalid payload, expected array of scans' });
    }
    const createdScans = await Scan.insertMany(scans);
    res.status(201).json(createdScans);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getScans,
  createScan,
  deleteScan,
  batchCreateScans,
};
