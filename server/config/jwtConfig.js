/**
 * JWT configuration loaded from environment variables.
 * Access token is short-lived (15m), refresh token is long-lived (7d).
 */
module.exports = {
  accessToken: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  },
  refreshToken: {
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
};
