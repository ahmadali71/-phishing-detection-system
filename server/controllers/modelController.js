const MLModel = require('../models/MLModel');

// @desc    Get all models
// @route   GET /api/models
// @access  Public
const getModels = async (req, res) => {
  try {
    const models = await MLModel.find().sort({ createdAt: -1 });
    res.status(200).json(models);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new model
// @route   POST /api/models
// @access  Private
const createModel = async (req, res) => {
  try {
    const { name, version, status, accuracy } = req.body;
    const modelData = { name, version, status, accuracy };
    const model = await MLModel.create(modelData);
    res.status(201).json(model);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a model
// @route   PUT /api/models/:id
// @access  Private
const updateModel = async (req, res) => {
  try {
    const model = await MLModel.findById(req.params.id);
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }
    Object.assign(model, req.body);
    await model.save();
    res.status(200).json(model);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a model
// @route   DELETE /api/models/:id
// @access  Private
const deleteModel = async (req, res) => {
  try {
    const model = await MLModel.findById(req.params.id);
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }
    await model.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getModels,
  createModel,
  updateModel,
  deleteModel,
};
