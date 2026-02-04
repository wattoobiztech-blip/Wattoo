const { validationResult } = require('express-validator');
const Helpers = require('../utils/helpers');

// Main validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value
    }));

    return res.status(400).json(
      Helpers.formatError('Validation failed', 400, formattedErrors)
    );
  }

  next();
};

// Sanitize request data
const sanitizeInput = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = Helpers.sanitizeObject(req.body);
  }
  
  if (req.query && typeof req.query === 'object') {
    req.query = Helpers.sanitizeObject(req.query);
  }
  
  if (req.params && typeof req.params === 'object') {
    req.params = Helpers.sanitizeObject(req.params);
  }
  
  next();
};

// Validate pagination parameters
const validatePagination = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  // Validate page
  if (page < 1) {
    return res.status(400).json(
      Helpers.formatError('Page must be a positive integer', 400)
    );
  }

  // Validate limit
  if (limit < 1 || limit > 100) {
    return res.status(400).json(
      Helpers.formatError('Limit must be between 1 and 100', 400)
    );
  }

  req.pagination = { page, limit };
  next();
};

// Validate search parameters
const validateSearch = (req, res, next) => {
  const { search } = req.query;

  if (search) {
    // Check search length
    if (search.length < 1 || search.length > 100) {
      return res.status(400).json(
        Helpers.formatError('Search term must be between 1 and 100 characters', 400)
      );
    }

    // Sanitize search term
    req.query.search = Helpers.sanitizeInput(search);
  }

  next();
};

// Validate file upload
const validateFileUpload = (allowedTypes = [], maxSize = 5 * 1024 * 1024) => {
  return (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json(
        Helpers.formatError('No files uploaded', 400)
      );
    }

    const file = req.files.file || req.files[Object.keys(req.files)[0]];

    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.mimetype)) {
      return res.status(400).json(
        Helpers.formatError(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`, 400)
      );
    }

    // Check file size
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      return res.status(400).json(
        Helpers.formatError(`File size too large. Maximum size: ${maxSizeMB}MB`, 400)
      );
    }

    // Validate file name
    if (!file.name || file.name.length > 255) {
      return res.status(400).json(
        Helpers.formatError('Invalid file name', 400)
      );
    }

    req.uploadedFile = file;
    next();
  };
};

// Validate ID parameter
const validateId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    
    if (!id) {
      return res.status(400).json(
        Helpers.formatError(`${paramName} is required`, 400)
      );
    }

    const numericId = parseInt(id);
    
    if (isNaN(numericId) || numericId < 1) {
      return res.status(400).json(
        Helpers.formatError(`${paramName} must be a positive integer`, 400)
      );
    }

    req.params[paramName] = numericId;
    next();
  };
};

// Validate email format
const validateEmailFormat = (req, res, next) => {
  const { email } = req.body;
  
  if (email && !Helpers.isValidEmail(email)) {
    return res.status(400).json(
      Helpers.formatError('Invalid email format', 400)
    );
  }

  next();
};

// Validate phone format
const validatePhoneFormat = (req, res, next) => {
  const { phone } = req.body;
  
  if (phone && !Helpers.isValidPhone(phone)) {
    return res.status(400).json(
      Helpers.formatError('Invalid phone number format', 400)
    );
  }

  next();
};

// Validate date format
const validateDateFormat = (fieldName) => {
  return (req, res, next) => {
    const dateValue = req.body[fieldName];
    
    if (dateValue && !Helpers.isValidDate(dateValue)) {
      return res.status(400).json(
        Helpers.formatError(`Invalid ${fieldName} format`, 400)
      );
    }

    next();
  };
};

// Validate age range
const validateAge = (minAge = 18, maxAge = 100) => {
  return (req, res, next) => {
    const { age, dateOfBirth } = req.body;
    
    let calculatedAge = age;
    
    if (dateOfBirth && !age) {
      calculatedAge = Helpers.calculateAge(dateOfBirth);
    }
    
    if (calculatedAge && (calculatedAge < minAge || calculatedAge > maxAge)) {
      return res.status(400).json(
        Helpers.formatError(`Age must be between ${minAge} and ${maxAge}`, 400)
      );
    }

    if (calculatedAge) {
      req.body.age = calculatedAge;
    }

    next();
  };
};

// Validate required fields
const validateRequired = (fields) => {
  return (req, res, next) => {
    const missingFields = [];
    
    fields.forEach(field => {
      if (!req.body[field] || (typeof req.body[field] === 'string' && req.body[field].trim() === '')) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      return res.status(400).json(
        Helpers.formatError(`Missing required fields: ${missingFields.join(', ')}`, 400)
      );
    }

    next();
  };
};

// Validate enum values
const validateEnum = (field, allowedValues) => {
  return (req, res, next) => {
    const value = req.body[field];
    
    if (value && !allowedValues.includes(value)) {
      return res.status(400).json(
        Helpers.formatError(`Invalid ${field}. Allowed values: ${allowedValues.join(', ')}`, 400)
      );
    }

    next();
  };
};

// Validate array fields
const validateArray = (field, minLength = 0, maxLength = 100) => {
  return (req, res, next) => {
    const value = req.body[field];
    
    if (value !== undefined) {
      if (!Array.isArray(value)) {
        return res.status(400).json(
          Helpers.formatError(`${field} must be an array`, 400)
        );
      }

      if (value.length < minLength || value.length > maxLength) {
        return res.status(400).json(
          Helpers.formatError(`${field} must have between ${minLength} and ${maxLength} items`, 400)
        );
      }
    }

    next();
  };
};

// Validate string length
const validateStringLength = (field, minLength = 0, maxLength = 255) => {
  return (req, res, next) => {
    const value = req.body[field];
    
    if (value !== undefined) {
      if (typeof value !== 'string') {
        return res.status(400).json(
          Helpers.formatError(`${field} must be a string`, 400)
        );
      }

      const trimmedValue = value.trim();
      
      if (trimmedValue.length < minLength || trimmedValue.length > maxLength) {
        return res.status(400).json(
          Helpers.formatError(`${field} must be between ${minLength} and ${maxLength} characters`, 400)
        );
      }

      req.body[field] = trimmedValue;
    }

    next();
  };
};

// Validate numeric range
const validateNumericRange = (field, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  return (req, res, next) => {
    const value = req.body[field];
    
    if (value !== undefined) {
      const numericValue = parseFloat(value);
      
      if (isNaN(numericValue)) {
        return res.status(400).json(
          Helpers.formatError(`${field} must be a number`, 400)
        );
      }

      if (numericValue < min || numericValue > max) {
        return res.status(400).json(
          Helpers.formatError(`${field} must be between ${min} and ${max}`, 400)
        );
      }

      req.body[field] = numericValue;
    }

    next();
  };
};

// Validate JSON field
const validateJSON = (field) => {
  return (req, res, next) => {
    const value = req.body[field];
    
    if (value !== undefined) {
      if (typeof value === 'string') {
        try {
          req.body[field] = JSON.parse(value);
        } catch (error) {
          return res.status(400).json(
            Helpers.formatError(`${field} must be valid JSON`, 400)
          );
        }
      } else if (typeof value !== 'object') {
        return res.status(400).json(
          Helpers.formatError(`${field} must be a valid JSON object`, 400)
        );
      }
    }

    next();
  };
};

// Custom validation function
const customValidation = (validationFn, errorMessage) => {
  return (req, res, next) => {
    try {
      const isValid = validationFn(req);
      
      if (!isValid) {
        return res.status(400).json(
          Helpers.formatError(errorMessage, 400)
        );
      }

      next();
    } catch (error) {
      return res.status(400).json(
        Helpers.formatError(errorMessage, 400)
      );
    }
  };
};

module.exports = {
  validate,
  sanitizeInput,
  validatePagination,
  validateSearch,
  validateFileUpload,
  validateId,
  validateEmailFormat,
  validatePhoneFormat,
  validateDateFormat,
  validateAge,
  validateRequired,
  validateEnum,
  validateArray,
  validateStringLength,
  validateNumericRange,
  validateJSON,
  customValidation
};