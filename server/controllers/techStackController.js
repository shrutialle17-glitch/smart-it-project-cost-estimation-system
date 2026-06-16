const TechStack = require('../models/TechStack');
const { sendResponse } = require('../utils/sendResponse');

// @desc    Get all tech stacks
// @route   GET /api/tech-stacks
// @access  Admin
const getTechStacks = async (req, res, next) => {
  try {
    const techStacks = await TechStack.find().populate('projectType', 'name slug icon');
    sendResponse(res, 200, 'Tech stacks fetched successfully', { techStacks });
  } catch (error) {
    next(error);
  }
};

// @desc    Get tech stack by project type ID
// @route   GET /api/tech-stacks/by-project/:projectTypeId
// @access  Client
const getTechStackByProjectType = async (req, res, next) => {
  try {
    const techStack = await TechStack.findOne({ projectType: req.params.projectTypeId, isActive: true });
    if (!techStack) return sendResponse(res, 404, 'Tech stack not found for this project type');
    sendResponse(res, 200, 'Tech stack fetched successfully', { techStack });
  } catch (error) {
    next(error);
  }
};

// @desc    Create tech stack
// @route   POST /api/tech-stacks
// @access  Admin
const createTechStack = async (req, res, next) => {
  try {
    const techStack = await TechStack.create(req.body);
    const populated = await TechStack.findById(techStack._id).populate('projectType', 'name slug icon');
    sendResponse(res, 201, 'Tech stack created successfully', { techStack: populated });
  } catch (error) {
    if (error.code === 11000) {
      return sendResponse(res, 400, 'A tech stack already exists for this project type');
    }
    next(error);
  }
};

// @desc    Update tech stack
// @route   PUT /api/tech-stacks/:id
// @access  Admin
const updateTechStack = async (req, res, next) => {
  try {
    const techStack = await TechStack.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('projectType', 'name slug icon');
    if (!techStack) return sendResponse(res, 404, 'Tech stack not found');
    sendResponse(res, 200, 'Tech stack updated successfully', { techStack });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete tech stack
// @route   DELETE /api/tech-stacks/:id
// @access  Admin
const deleteTechStack = async (req, res, next) => {
  try {
    const techStack = await TechStack.findByIdAndDelete(req.params.id);
    if (!techStack) return sendResponse(res, 404, 'Tech stack not found');
    sendResponse(res, 200, 'Tech stack deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTechStacks,
  getTechStackByProjectType,
  createTechStack,
  updateTechStack,
  deleteTechStack
};
