const express = require('express');
const router = express.Router();
const { getScans, createScan, deleteScan, batchCreateScans } = require('../controllers/scanController');
const { protect } = require('../middleware/authMiddleware');

// Using protect middleware loosely or strictly based on requirements
// Assuming frontend allows public scanning, but maybe admin viewing
router.route('/').get(getScans).post(createScan); // Optional: add protect to getScans if it's a private dashboard
router.route('/batch').post(protect, batchCreateScans);
router.route('/:id').delete(protect, deleteScan);

module.exports = router;
