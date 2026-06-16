/**
 * Consistent success response helper.
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Human-readable message
 * @param {object} data - Response payload
 * @param {object} [pagination] - Optional pagination info
 */
const sendResponse = (res, statusCode, message, data = null, pagination = null) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) response.data = data;
  if (pagination) response.pagination = pagination;

  return res.status(statusCode).json(response);
};

module.exports = { sendResponse };
