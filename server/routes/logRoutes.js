const express = require('express');
const router = express.Router();
const { getLogs, createLog } = require('../controllers/logController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getLogs).post(createLog);

module.exports = router;
