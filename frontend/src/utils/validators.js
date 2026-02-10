/**
 * Frontend validation utilities
 * Mirrors backend validation logic for consistency
 * Corresponds to backend validateInsertion and validateIntID methods
 */

/**
 * Validates that a value is a valid integer ID
 * @param {*} value - The value to validate
 * @param {Object} options - Validation options
 * @param {boolean} options.allowNull - Allow null values
 * @param {boolean} options.allowZero - Allow zero as valid ID
 * @returns {boolean} True if valid integer ID
 */
export const validateIntID = (value, options = {}) => {
  const { allowNull = false, allowZero = false } = options;

  if (allowNull && (value === null || value === undefined)) {
    return true;
  }

  if (value === null || value === undefined || value === '') {
    return false;
  }

  // Convert to number if it's a string
  const num = typeof value === 'string' ? parseInt(value, 10) : value;

  // Check if it's a valid integer
  if (!Number.isInteger(num)) {
    return false;
  }

  // Check if zero is allowed
  if (!allowZero && num === 0) {
    return false;
  }

  // Check if positive (IDs should be positive)
  if (num < 0) {
    return false;
  }

  return true;
};

/**
 * Validates insertion data for various entity types
 * Mirrors backend validateInsertion logic
 * @param {string} entityType - Type of entity ('user', 'travel_listing', 'itinerary')
 * @param {Object} data - Data object to validate
 * @returns {Object} { valid: boolean, errors: Array }
 */
export const validateInsertion = (entityType, data) => {
  const errors = [];

  switch (entityType.toLowerCase()) {
    case 'user':
      // Username validation
      if (!data.username || typeof data.username !== 'string' || data.username.trim().length < 3) {
        errors.push('Username must be at least 3 characters long');
      }

      // Email validation
      if (!data.email || !isValidEmail(data.email)) {
        errors.push('Valid email address is required');
      }

      // Password validation (for creation only)
      if (data.password !== undefined) {
        if (!data.password || data.password.length < 6) {
          errors.push('Password must be at least 6 characters long');
        }
      }

      // Role validation
      if (data.role && !['user', 'admin'].includes(data.role)) {
        errors.push('Role must be either "user" or "admin"');
      }

      // User ID validation (for updates)
      if (data.userid !== undefined && !validateIntID(data.userid)) {
        errors.push('Invalid user ID');
      }
      break;

    case 'travel_listing':
    case 'travellisting':
      // Title validation
      if (!data.title || typeof data.title !== 'string' || data.title.trim().length < 5) {
        errors.push('Title must be at least 5 characters long');
      }

      // Description validation
      if (!data.description || typeof data.description !== 'string' || data.description.trim().length < 20) {
        errors.push('Description must be at least 20 characters long');
      }

      // Location validation
      if (!data.location || typeof data.location !== 'string' || data.location.trim().length < 2) {
        errors.push('Valid location is required');
      }

      // Price validation
      if (data.price !== undefined) {
        const price = parseFloat(data.price);
        if (isNaN(price) || price < 0) {
          errors.push('Price must be a non-negative number');
        }
      }

      // Duration validation
      if (data.duration_days !== undefined) {
        const duration = parseInt(data.duration_days, 10);
        if (!validateIntID(duration, { allowZero: true })) {
          errors.push('Duration must be a non-negative integer');
        }
      }

      // Rating validation
      if (data.rating !== undefined) {
        const rating = parseFloat(data.rating);
        if (isNaN(rating) || rating < 0 || rating > 5) {
          errors.push('Rating must be between 0 and 5');
        }
      }

      // Travel ID validation (for updates)
      if (data.travelid !== undefined && !validateIntID(data.travelid)) {
        errors.push('Invalid travel listing ID');
      }
      break;

    case 'itinerary':
      // Travel ID validation (required for creation)
      if (data.travelid !== undefined && !validateIntID(data.travelid)) {
        errors.push('Valid travel ID is required');
      }

      // Day number validation
      if (data.day_number !== undefined) {
        const day = parseInt(data.day_number, 10);
        if (!validateIntID(day, { allowZero: true })) {
          errors.push('Day number must be a non-negative integer');
        }
      }

      // Activity validation
      if (!data.activity || typeof data.activity !== 'string' || data.activity.trim().length < 5) {
        errors.push('Activity description must be at least 5 characters long');
      }

      // Description validation (optional but if present, must be valid)
      if (data.description && (typeof data.description !== 'string' || data.description.trim().length < 10)) {
        errors.push('Description must be at least 10 characters long');
      }

      // Itinerary ID validation (for updates)
      if (data.itineraryid !== undefined && !validateIntID(data.itineraryid)) {
        errors.push('Invalid itinerary ID');
      }
      break;

    default:
      errors.push(`Unknown entity type: ${entityType}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    errorMap: errors.reduce((map, error, index) => {
      map[`error_${index}`] = error;
      return map;
    }, {})
  };
};

/**
 * Validates email format using regex
 * @param {string} email - Email string to validate
 * @returns {boolean} True if valid email format
 */
const isValidEmail = (email) => {
  // Standard email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {Object} { valid: boolean, strength: string, errors: Array }
 */
export const validatePasswordStrength = (password) => {
  const errors = [];
  let strength = 'weak';

  if (!password || password.length === 0) {
    return { valid: false, strength: 'none', errors: ['Password is required'] };
  }

  // Length check
  if (password.length < 8) {
    errors.push('Password should be at least 8 characters long');
  }

  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    errors.push('Password should contain at least one uppercase letter');
  }

  // Lowercase check
  if (!/[a-z]/.test(password)) {
    errors.push('Password should contain at least one lowercase letter');
  }

  // Number check
  if (!/[0-9]/.test(password)) {
    errors.push('Password should contain at least one number');
  }

  // Special character check
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password should contain at least one special character');
  }

  // Determine strength
  const passedChecks = 5 - errors.length;
  if (passedChecks === 5 && password.length >= 12) {
    strength = 'excellent';
  } else if (passedChecks >= 4) {
    strength = 'strong';
  } else if (passedChecks >= 3) {
    strength = 'medium';
  }

  return {
    valid: errors.length === 0,
    strength,
    errors,
    score: (passedChecks / 5) * 100
  };
};

/**
 * Validates search query for travel listings
 * @param {string} query - Search query string
 * @returns {Object} { valid: boolean, sanitized: string, errors: Array }
 */
export const validateSearchQuery = (query) => {
  const errors = [];

  if (!query || typeof query !== 'string') {
    errors.push('Search query must be a string');
    return { valid: false, sanitized: '', errors };
  }

  // Trim whitespace
  let sanitized = query.trim();

  // Check minimum length
  if (sanitized.length < 2) {
    errors.push('Search query must be at least 2 characters long');
  }

  // Check maximum length
  if (sanitized.length > 100) {
    errors.push('Search query cannot exceed 100 characters');
    sanitized = sanitized.substring(0, 100);
  }

  // Remove potentially dangerous characters (basic XSS prevention)
  sanitized = sanitized.replace(/[<>]/g, '');

  return {
    valid: errors.length === 0,
    sanitized,
    errors
  };
};

/**
 * Validates pagination parameters
 * @param {Object} params - Pagination parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @returns {Object} { valid: boolean, errors: Array }
 */
export const validatePagination = (params = {}) => {
  const errors = [];
  const { page = 1, limit = 10 } = params;

  // Validate page
  const pageNum = parseInt(page, 10);
  if (!validateIntID(pageNum, { allowZero: false })) {
    errors.push('Page must be a positive integer');
  } else if (pageNum < 1) {
    errors.push('Page must be at least 1');
  }

  // Validate limit
  const limitNum = parseInt(limit, 10);
  if (!validateIntID(limitNum, { allowZero: false })) {
    errors.push('Limit must be a positive integer');
  } else if (limitNum < 1) {
    errors.push('Limit must be at least 1');
  } else if (limitNum > 100) {
    errors.push('Limit cannot exceed 100');
  }

  return {
    valid: errors.length === 0,
    errors,
    sanitized: {
      page: pageNum,
      limit: limitNum
    }
  };
};

/**
 * Validates that a string is not empty or only whitespace
 * @param {string} str - String to validate
 * @param {string} fieldName - Name of the field for error messages
 * @returns {Object} { valid: boolean, errors: Array }
 */
export const validateRequiredString = (str, fieldName = 'Field') => {
  const errors = [];

  if (!str || typeof str !== 'string') {
    errors.push(`${fieldName} must be a string`);
    return { valid: false, errors };
  }

  if (str.trim().length === 0) {
    errors.push(`${fieldName} cannot be empty`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validates numeric range
 * @param {number} value - Value to validate
 * @param {Object} options - Range options
 * @param {number} options.min - Minimum allowed value
 * @param {number} options.max - Maximum allowed value
 * @param {string} options.fieldName - Name of the field
 * @returns {Object} { valid: boolean, errors: Array }
 */
export const validateNumericRange = (value, options = {}) => {
  const { min, max, fieldName = 'Value' } = options;
  const errors = [];

  const num = parseFloat(value);
  if (isNaN(num)) {
    errors.push(`${fieldName} must be a number`);
    return { valid: false, errors };
  }

  if (min !== undefined && num < min) {
    errors.push(`${fieldName} must be at least ${min}`);
  }

  if (max !== undefined && num > max) {
    errors.push(`${fieldName} cannot exceed ${max}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    value: num
  };
};

/**
 * Validates URL format
 * @param {string} url - URL string to validate
 * @returns {boolean} True if valid URL format
 */
export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validates phone number format (basic validation)
 * @param {string} phone - Phone number to validate
 * @returns {Object} { valid: boolean, errors: Array }
 */
export const validatePhoneNumber = (phone) => {
  const errors = [];

  if (!phone || typeof phone !== 'string') {
    errors.push('Phone number must be a string');
    return { valid: false, errors };
  }

  // Remove spaces, dashes, and parentheses
  const cleaned = phone.replace(/[\s\-()]/g, '');

  // Basic length check (7-15 digits)
  if (cleaned.length < 7 || cleaned.length > 15) {
    errors.push('Phone number must be between 7 and 15 digits');
  }

  // Check if all remaining characters are digits or +
  if (!/^[\d+]+$/.test(cleaned)) {
    errors.push('Phone number can only contain digits and + symbol');
  }

  return {
    valid: errors.length === 0,
    errors,
    sanitized: cleaned
  };
};

// Export utility for quick validation without error details
export const isValidInsertion = (entityType, data) => {
  const result = validateInsertion(entityType, data);
  return result.valid;
};

export const isValidID = (value) => {
  return validateIntID(value);
};

// Export all validators as default
export default {
  validateIntID,
  validateInsertion,
  isValidInsertion,
  isValidID,
  validatePasswordStrength,
  validateSearchQuery,
  validatePagination,
  validateRequiredString,
  validateNumericRange,
  isValidURL,
  validatePhoneNumber,
  isValidEmail
};