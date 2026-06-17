const Notification = require('../models/Notification');
const { sendResponse } = require('../utils/sendResponse');

const getNotifications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const total = await Notification.countDocuments({ recipient: req.user._id });
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate('sender', 'name email')
      .sort({ createdAt: -1 }).skip(skip).limit(limit);
    sendResponse(res, 200, 'Notifications retrieved', { notifications }, { page, limit, total, pages: Math.ceil(total / limit) });
  } catch (error) { next(error); }
};

const getUnreadCount = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({ recipient: req.user._id, isRead: false });
    sendResponse(res, 200, 'Unread count retrieved', { unreadCount: count });
  } catch (error) { next(error); }
};

const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true },
      { returnDocument: 'after' }
    );
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
    sendResponse(res, 200, 'Notification marked as read', { notification });
  } catch (error) { next(error); }
};

const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
    sendResponse(res, 200, 'All notifications marked as read');
  } catch (error) { next(error); }
};

const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user._id });
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
    sendResponse(res, 200, 'Notification deleted');
  } catch (error) { next(error); }
};

module.exports = { getNotifications, getUnreadCount, markAsRead, markAllAsRead, deleteNotification };
