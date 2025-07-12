const { body, validationResult } = require('express-validator')

// Validation rules for product creation/update
const validateProduct = [
  body('title')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Title must be between 2 and 100 characters')
    .notEmpty()
    .withMessage('Title is required'),
  
  body('image')
    .trim()
    .isURL()
    .withMessage('Image must be a valid URL')
    .notEmpty()
    .withMessage('Image URL is required'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters')
    .notEmpty()
    .withMessage('Description is required'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number')
    .notEmpty()
    .withMessage('Price is required')
]

// Middleware to check for validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    })
  }
  next()
}

module.exports = {
  validateProduct,
  handleValidationErrors
} 