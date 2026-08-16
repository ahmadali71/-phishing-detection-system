const express = require('express');
const router = express.Router();
const { getModels, createModel, updateModel, deleteModel } = require('../controllers/modelController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getModels).post(protect, createModel);
router.route('/:id').put(protect, updateModel).delete(protect, deleteModel);

module.exports = router;
