const express = require('express');
const { body } = require('express-validator');
//const { validate } = require('../middlewares/validateMiddleware');
//const { protect } = require('../middlewares/authMiddleware');
//const { roleMiddleware } = require('../middlewares/roleMiddleware');
const { getFeatures, createFeature, updateFeature, deleteFeature } = require('../controllers/featureController');

const router = express.Router();

const featureValidation = [
  body('name').trim().notEmpty().withMessage('Feature name is required'),
  body('baseHours').isNumeric().withMessage('Base hours must be a number').custom(v => v >= 1).withMessage('Base hours min 1'),
  body('complexityWeight').isNumeric().withMessage('Complexity weight must be a number').custom(v => v >= 1 && v <= 10).withMessage('Complexity weight must be 1-10'),
  body('category').isIn(['core', 'security', 'integration', 'ai', 'communication', 'analytics', 'storage', 'localization']).withMessage('Invalid category'),
];


router.get('/', getFeatures);
router.post('/', createFeature);
router.put('/:id', updateFeature);
router.delete('/:id', deleteFeature);

/*
router.get('/', protect, getFeatures);
router.post('/', protect, roleMiddleware('admin'), featureValidation, validate, createFeature);
router.put('/:id', protect, roleMiddleware('admin'), updateFeature);
router.delete('/:id', protect, roleMiddleware('admin'), deleteFeature);
*/
module.exports = router;
