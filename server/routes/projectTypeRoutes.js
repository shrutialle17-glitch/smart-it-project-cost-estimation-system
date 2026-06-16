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
//const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getProjectTypes);
router.get('/:id', getProjectType);

router.get('/admin/all', getAllProjectTypes);
router.put('/admin/reorder', reorderProjectTypes);
router.post('/', createProjectType);
router.put('/:id', updateProjectType);
router.patch('/:id/toggle', toggleProjectType);
router.delete('/:id', deleteProjectType);
/*
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
*/
module.exports = router;
