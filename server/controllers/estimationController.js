const Estimation = require('../models/Estimation');
const { calculateEstimation } = require('../services/estimationEngine');
//const { notifyAdminsNewEstimation } = require('../services/notificationService');
const { sendResponse } = require('../utils/sendResponse');

/**
 * @desc    Calculate estimate without saving (preview)
 * @route   POST /api/estimations/calculate
 * @access  Private (Client)
 */
const calculate = async (req, res, next) => {
  try {
    const { projectType, selectedFeatures, projectName } = req.body;

    const result = await calculateEstimation(projectType, selectedFeatures, projectName);
    sendResponse(res, 200, 'Estimation calculated successfully', { estimation: result });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Save a calculated estimation to the database
 * @route   POST /api/estimations/save
 * @access  Private (Client)
 */
const save = async (req, res, next) => {
  try {
    const { projectType, selectedFeatures, projectName, notes } = req.body;

    // Calculate the estimation
    const result = await calculateEstimation(projectType, selectedFeatures, projectName);

    // Save to database
    const estimation = await Estimation.create({
      client: req.user._id,
      projectName: result.projectName,
      projectType: result.projectType,
      selectedFeatures: result.selectedFeatures,
      calculation: result.calculation,
      complexity: result.complexity,
      timeline: result.timeline,
      recommendedTechStack: result.recommendedTechStack,
      notes: notes || '',
      status: 'saved',
    });

    // Notify all admins
    await notifyAdminsNewEstimation(estimation, req.user);

    sendResponse(res, 201, 'Estimation saved successfully', { estimation });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current client's estimations
 * @route   GET /api/estimations/my
 * @access  Private (Client)
 */
const getMyEstimations = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Estimation.countDocuments({ client: req.user._id });
    const estimations = await Estimation.find({ client: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('projectType', 'name slug icon');

    sendResponse(res, 200, 'Estimations retrieved', { estimations }, {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single estimation by ID
 * @route   GET /api/estimations/:id
 * @access  Private
 */
const getEstimation = async (req, res, next) => {
  try {
    const estimation = await Estimation.findById(req.params.id)
      .populate('client', 'name email company')
      .populate('projectType', 'name slug icon');

    if (!estimation) {
      return res.status(404).json({ success: false, message: 'Estimation not found' });
    }

    // Clients can only view their own estimations
    if (req.user.role === 'client' && estimation.client._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    sendResponse(res, 200, 'Estimation retrieved', { estimation });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an estimation
 * @route   DELETE /api/estimations/:id
 * @access  Private (Client - own only)
 */
const deleteEstimation = async (req, res, next) => {
  try {
    const estimation = await Estimation.findById(req.params.id);

    if (!estimation) {
      return res.status(404).json({ success: false, message: 'Estimation not found' });
    }

    if (estimation.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    await Estimation.findByIdAndDelete(req.params.id);
    sendResponse(res, 200, 'Estimation deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { calculate, save, getMyEstimations, getEstimation, deleteEstimation };
