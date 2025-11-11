/**
 * Response Helper
 * Standardizes API responses with language support
 */

const { translate } = require('../services/translationService');
const { formatLocalizedResponse } = require('../middleware/language');

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {Object} options - Response options
 * @param {string} options.message - Success message key
 * @param {*} options.data - Response data
 * @param {number} options.statusCode - HTTP status code (default: 200)
 * @param {string} options.language - Language code (default: 'en')
 * @param {Object} options.variables - Variables for message translation
 * @param {Object} options.meta - Additional metadata
 */
const sendSuccess = (res, options = {}) => {
  const {
    message = 'success',
    data = null,
    statusCode = 200,
    language = 'en',
    variables = {},
    meta = {}
  } = options;

  const response = {
    success: true,
    message: translate(message, language, variables),
    ...(data !== null && { data: formatLocalizedResponse(data, language) }),
    ...(Object.keys(meta).length > 0 && { meta })
  };

  res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {Object} options - Response options
 * @param {string} options.message - Error message key
 * @param {number} options.statusCode - HTTP status code (default: 500)
 * @param {string} options.language - Language code (default: 'en')
 * @param {Object} options.variables - Variables for message translation
 * @param {*} options.error - Error details
 * @param {Object} options.meta - Additional metadata
 */
const sendError = (res, options = {}) => {
  const {
    message = 'server_error',
    statusCode = 500,
    language = 'en',
    variables = {},
    error = null,
    meta = {}
  } = options;

  const response = {
    success: false,
    message: translate(message, language, variables),
    ...(error && { error }),
    ...(Object.keys(meta).length > 0 && { meta })
  };

  res.status(statusCode).json(response);
};

/**
 * Send validation error response
 * @param {Object} res - Express response object
 * @param {Object} options - Response options
 * @param {Array} options.errors - Validation errors
 * @param {string} options.language - Language code (default: 'en')
 * @param {string} options.message - Error message key (default: 'validation_error')
 */
const sendValidationError = (res, options = {}) => {
  const {
    errors = [],
    language = 'en',
    message = 'validation_error'
  } = options;

  const response = {
    success: false,
    message: translate(message, language),
    errors: errors.map(err => ({
      field: err.field || err.path,
      message: translate(err.message, language, err.variables || {}),
      value: err.value
    }))
  };

  res.status(400).json(response);
};

/**
 * Send not found response
 * @param {Object} res - Express response object
 * @param {Object} options - Response options
 * @param {string} options.message - Error message key (default: 'not_found')
 * @param {string} options.language - Language code (default: 'en')
 * @param {Object} options.variables - Variables for message translation
 */
const sendNotFound = (res, options = {}) => {
  const {
    message = 'not_found',
    language = 'en',
    variables = {}
  } = options;

  sendError(res, {
    message,
    statusCode: 404,
    language,
    variables
  });
};

/**
 * Send unauthorized response
 * @param {Object} res - Express response object
 * @param {Object} options - Response options
 * @param {string} options.message - Error message key (default: 'unauthorized')
 * @param {string} options.language - Language code (default: 'en')
 * @param {Object} options.variables - Variables for message translation
 */
const sendUnauthorized = (res, options = {}) => {
  const {
    message = 'unauthorized',
    language = 'en',
    variables = {}
  } = options;

  sendError(res, {
    message,
    statusCode: 401,
    language,
    variables
  });
};

/**
 * Send forbidden response
 * @param {Object} res - Express response object
 * @param {Object} options - Response options
 * @param {string} options.message - Error message key (default: 'forbidden')
 * @param {string} options.language - Language code (default: 'en')
 * @param {Object} options.variables - Variables for message translation
 */
const sendForbidden = (res, options = {}) => {
  const {
    message = 'forbidden',
    language = 'en',
    variables = {}
  } = options;

  sendError(res, {
    message,
    statusCode: 403,
    language,
    variables
  });
};

/**
 * Send conflict response
 * @param {Object} res - Express response object
 * @param {Object} options - Response options
 * @param {string} options.message - Error message key (default: 'already_exists')
 * @param {string} options.language - Language code (default: 'en')
 * @param {Object} options.variables - Variables for message translation
 */
const sendConflict = (res, options = {}) => {
  const {
    message = 'already_exists',
    language = 'en',
    variables = {}
  } = options;

  sendError(res, {
    message,
    statusCode: 409,
    language,
    variables
  });
};

/**
 * Send paginated response
 * @param {Object} res - Express response object
 * @param {Object} options - Response options
 * @param {Array} options.data - Response data array
 * @param {Object} options.pagination - Pagination info
 * @param {string} options.message - Success message key (default: 'retrieved_successfully')
 * @param {string} options.language - Language code (default: 'en')
 * @param {Object} options.variables - Variables for message translation
 */
const sendPaginated = (res, options = {}) => {
  const {
    data = [],
    pagination = {},
    message = 'retrieved_successfully',
    language = 'en',
    variables = {},
    meta = {}
  } = options;

  const response = {
    success: true,
    message: translate(message, language, variables),
    data: formatLocalizedResponse(data, language),
    pagination: {
      current_page: pagination.current_page || 1,
      total_pages: pagination.total_pages || 1,
      total_items: pagination.total_items || data.length,
      limit: pagination.limit || 10,
      has_next: pagination.has_next || false,
      has_prev: pagination.has_prev || false,
      ...pagination
    }
  };
  
  // Add meta if provided
  if (Object.keys(meta).length > 0) {
    response.meta = formatLocalizedResponse(meta, language);
  }

  res.status(200).json(response);
};

/**
 * Send created response
 * @param {Object} res - Express response object
 * @param {Object} options - Response options
 * @param {*} options.data - Response data
 * @param {string} options.message - Success message key (default: 'created_successfully')
 * @param {string} options.language - Language code (default: 'en')
 * @param {Object} options.variables - Variables for message translation
 */
const sendCreated = (res, options = {}) => {
  const {
    data = null,
    message = 'created_successfully',
    language = 'en',
    variables = {}
  } = options;

  sendSuccess(res, {
    message,
    data,
    statusCode: 201,
    language,
    variables
  });
};

/**
 * Send updated response
 * @param {Object} res - Express response object
 * @param {Object} options - Response options
 * @param {*} options.data - Response data
 * @param {string} options.message - Success message key (default: 'updated_successfully')
 * @param {string} options.language - Language code (default: 'en')
 * @param {Object} options.variables - Variables for message translation
 */
const sendUpdated = (res, options = {}) => {
  const {
    data = null,
    message = 'updated_successfully',
    language = 'en',
    variables = {}
  } = options;

  sendSuccess(res, {
    message,
    data,
    statusCode: 200,
    language,
    variables
  });
};

/**
 * Send deleted response
 * @param {Object} res - Express response object
 * @param {Object} options - Response options
 * @param {string} options.message - Success message key (default: 'deleted_successfully')
 * @param {string} options.language - Language code (default: 'en')
 * @param {Object} options.variables - Variables for message translation
 */
const sendDeleted = (res, options = {}) => {
  const {
    message = 'deleted_successfully',
    language = 'en',
    variables = {}
  } = options;

  sendSuccess(res, {
    message,
    statusCode: 200,
    language,
    variables
  });
};

module.exports = {
  sendSuccess,
  sendError,
  sendValidationError,
  sendNotFound,
  sendUnauthorized,
  sendForbidden,
  sendConflict,
  sendPaginated,
  sendCreated,
  sendUpdated,
  sendDeleted,
};

