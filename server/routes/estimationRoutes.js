const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validateMiddleware');
const { protect } = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');
const { calculate, save, getMyEstimations, getEstimation, deleteEstimation } = require('../controllers/estimationController');

const router = express.Router();

const estimationValidation = [
  body('projectName').trim().notEmpty().withMessage('Project name is required').isLength({ min: 3, max: 200 }),
  body('projectType').isMongoId().withMessage('Invalid project type'),
  body('selectedFeatures').isArray({ min: 1 }).withMessage('At least 1 feature must be selected'),
];

router.post('/calculate', protect, roleMiddleware('client'), estimationValidation, validate, calculate);
router.post('/save', protect, roleMiddleware('client'), estimationValidation, validate, save);
router.get('/my', protect, roleMiddleware('client'), getMyEstimations);
router.get('/:id', protect, getEstimation);
router.delete('/:id', protect, roleMiddleware('client'), deleteEstimation);

module.exports = router;
