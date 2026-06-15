/**
 * Role-based access control middleware factory.
 * Usage: roleMiddleware('admin') or roleMiddleware('client', 'admin')
 * @param {...string} roles - Allowed roles
 * @returns {Function} Express middleware
 */
const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized — please log in',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied — requires ${roles.join(' or ')} role`,
      });
    }

    next();
  };
};

module.exports = { roleMiddleware };
