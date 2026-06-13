const express = require('express');
const {
  getTechStacks,
  getTechStackByProjectType,
  createTechStack,
  updateTechStack,
  deleteTechStack
} = require('../controllers/techStackController');
//const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/by-project/:projectTypeId', getTechStackByProjectType);

router.route('/')
  .get(getTechStacks)
  .post(createTechStack);

router.route('/:id')
  .put(updateTechStack)
  .delete(deleteTechStack);

/*
router.get('/by-project/:projectTypeId', protect, getTechStackByProjectType);

router.use(protect, admin);
router.route('/')
  .get(getTechStacks)
  .post(createTechStack);

router.route('/:id')
  .put(updateTechStack)
  .delete(deleteTechStack);
*/

module.exports = router;
