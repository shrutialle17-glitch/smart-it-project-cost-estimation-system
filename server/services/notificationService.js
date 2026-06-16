const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * Create a notification and save it to the database.
 * @param {object} params
 * @param {string} params.recipientId - User ID of the notification recipient
 * @param {string} [params.senderId] - User ID of the sender
 * @param {string} params.type - Notification type enum
 * @param {string} params.title - Notification title
 * @param {string} params.message - Notification message body
 * @param {string} [params.link] - Optional link to navigate to
 * @param {string} [params.estimationId] - Optional related estimation ID
 * @returns {Promise<object>} Created notification document
 */
const createNotification = async ({ recipientId, senderId, type, title, message, link, estimationId }) => {
  try {
    const notification = await Notification.create({
      recipient: recipientId,
      sender: senderId || null,
      type,
      title,
      message,
      link: link || null,
      relatedEstimation: estimationId || null,
    });
    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error.message);
    // Don't throw — notifications should not break the main flow
    return null;
  }
};

/**
 * Notify all admins about a new estimation.
 * @param {object} estimation - The saved estimation
 * @param {object} client - The client who created it
 */
const notifyAdminsNewEstimation = async (estimation, client) => {
  try {
    const admins = await User.find({ role: 'admin', isActive: true });
    const promises = admins.map((admin) =>
      createNotification({
        recipientId: admin._id,
        senderId: client._id,
        type: 'new_estimation',
        title: 'New Estimation Created',
        message: `${client.name} created a new estimation for "${estimation.projectName}" — ₹${estimation.calculation.totalCost.toLocaleString('en-IN')}`,
        link: `/admin/estimations`,
        estimationId: estimation._id,
      })
    );
    await Promise.all(promises);
  } catch (error) {
    console.error('Failed to notify admins:', error.message);
  }
};

/**
 * Notify a client about their estimation status change.
 * @param {object} estimation - The updated estimation
 * @param {string} newStatus - The new status
 */
const notifyClientStatusUpdate = async (estimation, newStatus) => {
  try {
    await createNotification({
      recipientId: estimation.client,
      type: 'estimation_status',
      title: 'Estimation Status Updated',
      message: `Your estimation "${estimation.projectName}" has been ${newStatus}.`,
      link: `/estimations/${estimation._id}`,
      estimationId: estimation._id,
    });
  } catch (error) {
    console.error('Failed to notify client:', error.message);
  }
};

module.exports = {
  createNotification,
  notifyAdminsNewEstimation,
  notifyClientStatusUpdate,
};
