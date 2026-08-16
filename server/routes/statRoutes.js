const express = require('express');
const router = express.Router();
const { getStats, updateStats } = require('../controllers/statController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getStats).put(protect, updateStats);

module.exports = router;
