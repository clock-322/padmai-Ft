const { body, validationResult } = require('express-validator');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Register validation rules
const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['parent', 'teacher', 'admin']).withMessage('Role must be parent, teacher, or admin'),
  handleValidationErrors
];

// Login validation rules
const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

// Add Payment validation rules
const validateAddPayment = [
  // Normalize incoming body keys and defaults
  (req, res, next) => {
    if (!req.body.className && req.body.class) {
      req.body.className = req.body.class;
    }
    if (!req.body.name || req.body.name.trim() === '') {
      req.body.name = 'Payment';
    }
    next();
  },
  body('studentId')
    .trim()
    .notEmpty().withMessage('Student ID is required'),
  body('studentName')
    .trim()
    .notEmpty().withMessage('Student name is required'),
  body('className')
    .trim()
    .notEmpty().withMessage('Class name is required'),
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required'),
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isNumeric().withMessage('Amount must be a number')
    .isFloat({ min: 0 }).withMessage('Amount must be positive'),
  body('paymentType')
    .trim()
    .notEmpty().withMessage('Payment type is required'),
  handleValidationErrors
];

// Get Payment validation rules
const validateGetPayment = [
  body('studentId')
    .trim()
    .notEmpty().withMessage('Student ID is required'),
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateAddPayment,
  validateGetPayment
};

