const { body } = require('express-validator');

// Validation rules for expense creation
exports.createExpenseValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title must be less than 200 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 0.01, max: 999999.99 })
    .withMessage('Amount must be between 0.01 and 999999.99'),
  
  body('currency')
    .optional()
    .isLength({ max: 3 })
    .withMessage('Currency must be a 3-letter code')
    .matches(/^[A-Z]{3}$/)
    .withMessage('Currency must be uppercase (e.g., USD, EUR)'),
  
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['travel', 'meals', 'accommodation', 'office_supplies', 'training', 'equipment', 'other'])
    .withMessage('Invalid category'),
  
  body('expense_date')
    .notEmpty()
    .withMessage('Expense date is required')
    .isDate()
    .withMessage('Expense date must be a valid date'),
  
  body('is_urgent')
    .optional()
    .isBoolean()
    .withMessage('is_urgent must be a boolean'),
];

// Validation rules for expense submission
exports.submitExpenseValidation = [
  body('expense_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Expense ID must be a positive integer'),
];

// Validation rules for approval actions
exports.approvalValidation = [
  body('action')
    .notEmpty()
    .withMessage('Action is required')
    .isIn(['approve', 'reject'])
    .withMessage('Action must be either approve or reject'),
  
  body('comments')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Comments must be less than 500 characters'),
];
