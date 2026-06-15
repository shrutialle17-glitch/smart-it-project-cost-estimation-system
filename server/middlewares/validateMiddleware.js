const { validationResult } = require('express-validator');

/**
 * Middleware to check express-validator results.
 * If validation errors exist, returns 422 with error details.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.error('Validation Error payload:', req.body);
    console.error('Validation Errors:', errors.array());
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  next();
};

module.exports = { validate };
