const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');
const { getStats, getClients, getClient, getAllEstimations, updateEstimationStatus } = require('../controllers/adminController');

const router = express.Router();

router.use(protect, roleMiddleware('admin'));

router.get('/stats', getStats);
router.get('/clients', getClients);
router.get('/clients/:id', getClient);
router.get('/estimations', getAllEstimations);
router.put('/estimations/:id/status', updateEstimationStatus);

module.exports = router;
