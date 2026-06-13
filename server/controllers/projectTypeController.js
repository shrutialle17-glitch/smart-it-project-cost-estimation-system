const ProjectType = require('../models/ProjectType');
const { sendResponse } = require('../utils/sendResponse');

// @desc    Get all active project types (client)
// @route   GET /api/project-types
// @access  Public or Client
const getProjectTypes = async (req, res, next) => {
  try {
    const projectTypes = await ProjectType.find({ isActive: true }).sort({ displayOrder: 1 });
    sendResponse(res, 200, 'Project types fetched successfully', { projectTypes });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all project types including inactive (admin)
// @route   GET /api/project-types/all
// @access  Admin
const getAllProjectTypes = async (req, res, next) => {
  try {
    const projectTypes = await ProjectType.find().sort({ displayOrder: 1 });
    sendResponse(res, 200, 'All project types fetched successfully', { projectTypes });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project type
// @route   GET /api/project-types/:id
// @access  Public or Client
const getProjectType = async (req, res, next) => {
  try {
    const projectType = await ProjectType.findById(req.params.id);
    if (!projectType) return sendResponse(res, 404, 'Project type not found');
    sendResponse(res, 200, 'Project type fetched successfully', { projectType });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new project type
// @route   POST /api/project-types
// @access  Admin
const createProjectType = async (req, res, next) => {
  try {
    const projectType = await ProjectType.create(req.body);
    sendResponse(res, 201, 'Project type created successfully', { projectType });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project type
// @route   PUT /api/project-types/:id
// @access  Admin
const updateProjectType = async (req, res, next) => {
  try {
    const projectType = await ProjectType.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!projectType) return sendResponse(res, 404, 'Project type not found');
    sendResponse(res, 200, 'Project type updated successfully', { projectType });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle project type active status
// @route   PATCH /api/project-types/:id/toggle
// @access  Admin
const toggleProjectType = async (req, res, next) => {
  try {
    const projectType = await ProjectType.findById(req.params.id);
    if (!projectType) return sendResponse(res, 404, 'Project type not found');
    
    projectType.isActive = !projectType.isActive;
    await projectType.save();
    
    sendResponse(res, 200, `Project type ${projectType.isActive ? 'activated' : 'deactivated'} successfully`, { projectType });
  } catch (error) {
    next(error);
  }
};

// @desc    Soft delete project type
// @route   DELETE /api/project-types/:id
// @access  Admin
const deleteProjectType = async (req, res, next) => {
  try {
    const projectType = await ProjectType.findById(req.params.id);
    if (!projectType) return sendResponse(res, 404, 'Project type not found');
    
    projectType.isActive = false;
    await projectType.save();
    
    sendResponse(res, 200, 'Project type deactivated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Update display order
// @route   PUT /api/project-types/reorder
// @access  Admin
const reorderProjectTypes = async (req, res, next) => {
  try {
    const { orderedIds } = req.body;
    
    if (!orderedIds || !Array.isArray(orderedIds)) {
      return sendResponse(res, 400, 'Invalid data format');
    }

    const updates = orderedIds.map((id, index) => 
      ProjectType.findByIdAndUpdate(id, { displayOrder: index })
    );
    
    await Promise.all(updates);
    
    const projectTypes = await ProjectType.find().sort({ displayOrder: 1 });
    sendResponse(res, 200, 'Project types reordered successfully', { projectTypes });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjectTypes,
  getAllProjectTypes,
  getProjectType,
  createProjectType,
  updateProjectType,
  toggleProjectType,
  deleteProjectType,
  reorderProjectTypes
};
