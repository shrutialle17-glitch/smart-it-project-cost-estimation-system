const Feature = require('../models/Feature');
const { sendResponse } = require('../utils/sendResponse');

/**
 * @desc    Get all active features
 * @route   GET /api/features
 * @access  Private
 */
const getFeatures = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;

    const features = await Feature.find(filter).sort({ category: 1, name: 1 });
    sendResponse(res, 200, 'Features retrieved', { features });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new feature
 * @route   POST /api/features
 * @access  Admin
 */
const createFeature = async (req, res, next) => {
  try {
    const { name, description, category, baseHours, complexityWeight, icon } = req.body;

    const feature = await Feature.create({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/(^_|_$)/g, ''),
      description,
      category,
      baseHours,
      complexityWeight,
      icon,
    });

    sendResponse(res, 201, 'Feature created successfully', { feature });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a feature
 * @route   PUT /api/features/:id
 * @access  Admin
 */
const updateFeature = async (req, res, next) => {
  try {
    const { name, description, category, baseHours, complexityWeight, icon, isActive } = req.body;

    const feature = await Feature.findByIdAndUpdate(
      req.params.id,
      { name, description, category, baseHours, complexityWeight, icon, isActive },
      { new: true, runValidators: true }
    );

    if (!feature) {
      return res.status(404).json({ success: false, message: 'Feature not found' });
    }

    sendResponse(res, 200, 'Feature updated successfully', { feature });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Soft delete a feature (set isActive to false)
 * @route   DELETE /api/features/:id
 * @access  Admin
 */
const deleteFeature = async (req, res, next) => {
  try {
    const feature = await Feature.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!feature) {
      return res.status(404).json({ success: false, message: 'Feature not found' });
    }

    sendResponse(res, 200, 'Feature deactivated successfully', { feature });
  } catch (error) {
    next(error);
  }
};

module.exports = { getFeatures, createFeature, updateFeature, deleteFeature };
