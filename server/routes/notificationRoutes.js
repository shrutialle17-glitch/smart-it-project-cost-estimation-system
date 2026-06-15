const express = require('express');const { protect } = require('../middlewares/authMiddleware');
const { getNotifications, getUnreadCount, markAsRead, markAllAsRead, deleteNotification } = require('../controllers/notificationController');

const router = express.Router();

router.use(protect);

router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/:id/read', markAsRead);
router.put('/mark-all-read', markAllAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;
