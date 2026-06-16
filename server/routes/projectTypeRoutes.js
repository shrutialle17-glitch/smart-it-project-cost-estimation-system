const express = require('express');
const {
  getProjectTypes,
  getAllProjectTypes,
  getProjectType,
  createProjectType,
  updateProjectType,
  toggleProjectType,
  deleteProjectType,
  reorderProjectTypes
} = require('../controllers/projectTypeController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Client routes
router.get('/', protect, getProjectTypes);
router.get('/:id', protect, getProjectType);

// Admin routes
router.get('/admin/all', protect, admin, getAllProjectTypes);
router.put('/admin/reorder', protect, admin, reorderProjectTypes);
router.post('/', protect, admin, createProjectType);
router.put('/:id', protect, admin, updateProjectType);
router.patch('/:id/toggle', protect, admin, toggleProjectType);
router.delete('/:id', protect, admin, deleteProjectType);

module.exports = router;
