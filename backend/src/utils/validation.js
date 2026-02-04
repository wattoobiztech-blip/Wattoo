const { body, param, query, validationResult } = require('express-validator');

// Validation helper functions
class ValidationUtils {
  
  // Check validation results
  static checkValidation(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }

  // Email validation
  static validateEmail() {
    return body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address');
  }

  // Password validation
  static validatePassword() {
    return body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number');
  }

  // Phone validation
  static validatePhone() {
    return body('phone')
      .optional()
      .isMobilePhone()
      .withMessage('Please provide a valid phone number');
  }

  // Name validation
  static validateName(field = 'name') {
    return body(field)
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage(`${field} must be between 2 and 50 characters`)
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage(`${field} can only contain letters and spaces`);
  }

  // Age validation
  static validateAge() {
    return body('age')
      .isInt({ min: 18, max: 100 })
      .withMessage('Age must be between 18 and 100');
  }

  // Gender validation
  static validateGender() {
    return body('gender')
      .isIn(['male', 'female', 'other'])
      .withMessage('Gender must be male, female, or other');
  }

  // ID parameter validation
  static validateId(param = 'id') {
    return param(param)
      .isInt({ min: 1 })
      .withMessage(`${param} must be a positive integer`);
  }

  // Pagination validation
  static validatePagination() {
    return [
      query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
      query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100')
    ];
  }

  // Search validation
  static validateSearch() {
    return query('search')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Search term must be between 1 and 100 characters');
  }

  // Profile validation rules
  static validateProfile() {
    return [
      this.validateName('name'),
      this.validateAge(),
      body('cast')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Cast must be less than 50 characters'),
      body('religion')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Religion must be less than 50 characters'),
      body('height')
        .optional()
        .trim()
        .matches(/^\d+(\.\d+)?\s*(ft|cm|inches?)$/i)
        .withMessage('Height must be in valid format (e.g., 5.8 ft, 175 cm)'),
      body('city')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('City must be less than 100 characters'),
      body('state')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('State must be less than 100 characters'),
      body('country')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Country must be less than 100 characters')
    ];
  }

  // Registration validation
  static validateRegistration() {
    return [
      this.validateName('fullName'),
      this.validateEmail(),
      this.validatePassword(),
      this.validatePhone(),
      this.validateGender(),
      body('confirmPassword')
        .custom((value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('Passwords do not match');
          }
          return true;
        })
    ];
  }

  // Login validation
  static validateLogin() {
    return [
      this.validateEmail(),
      body('password')
        .notEmpty()
        .withMessage('Password is required')
    ];
  }

  // Subscription validation
  static validateSubscription() {
    return [
      body('planType')
        .isIn(['golden', 'diamond', 'elite'])
        .withMessage('Plan type must be golden, diamond, or elite'),
      body('paymentMethod')
        .isIn(['credit_card', 'debit_card', 'paypal', 'bank_transfer'])
        .withMessage('Invalid payment method')
    ];
  }

  // Admin comment validation
  static validateAdminComment() {
    return [
      body('profileId')
        .isInt({ min: 1 })
        .withMessage('Profile ID must be a positive integer'),
      body('comment')
        .trim()
        .isLength({ min: 1, max: 1000 })
        .withMessage('Comment must be between 1 and 1000 characters'),
      body('category')
        .isIn(['background_check', 'verification', 'support', 'matchmaking', 'red_flag', 'general'])
        .withMessage('Invalid comment category')
    ];
  }

  // File upload validation
  static validateFileUpload() {
    return (req, res, next) => {
      if (!req.files || !req.files.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const file = req.files.file;
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed'
        });
      }

      if (file.size > maxSize) {
        return res.status(400).json({
          success: false,
          message: 'File size too large. Maximum size is 5MB'
        });
      }

      next();
    };
  }

  // Sanitize input
  static sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, ''); // Remove event handlers
  }

  // Validate and sanitize object
  static sanitizeObject(obj) {
    const sanitized = {};
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeInput(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }
}

module.exports = ValidationUtils;