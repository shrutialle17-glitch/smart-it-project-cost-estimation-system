const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');

/**
 * Generate a JWT access token for the given user ID.
 * Short-lived (15 minutes by default).
 * @param {string} userId - MongoDB user ID
 * @returns {string} Signed JWT
 */
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, jwtConfig.accessToken.secret, {
    expiresIn: jwtConfig.accessToken.expiresIn,
  });
};

/**
 * Generate a JWT refresh token for the given user ID.
 * Long-lived (7 days by default).
 * @param {string} userId - MongoDB user ID
 * @returns {string} Signed JWT
 */
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, jwtConfig.refreshToken.secret, {
    expiresIn: jwtConfig.refreshToken.expiresIn,
  });
};

module.exports = { generateAccessToken, generateRefreshToken };
