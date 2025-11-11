/**
 * Language Middleware
 * Handles language detection and sets language context for the request
 */

const supportedLanguages = ['en', 'ar'];
const defaultLanguage = 'en';

/**
 * Language middleware to detect and set language from header
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const languageMiddleware = (req, res, next) => {
  // Get language from header (lang: ar or en, or Content-Language)
  const langHeader = req.headers['lang'] || req.headers['language'] || req.headers['content-language'] || req.headers['accept-language'];
  
  let language = defaultLanguage;
  
  if (langHeader) {
    // Extract language code (e.g., 'ar' from 'ar' or 'ar-SA')
    const langCode = langHeader.toLowerCase().split('-')[0].split(',')[0].trim();
    
    if (supportedLanguages.includes(langCode)) {
      language = langCode;
    }
  }
  
  // Set language in request object for use in controllers
  req.language = language;
  req.isRTL = language === 'ar'; // Right-to-left for Arabic
  
  // Add language to response headers for client reference
  res.setHeader('Content-Language', language);
  
  next();
};

/**
 * Get localized field value based on language
 * @param {Object} obj - Object containing localized fields
 * @param {string} fieldName - Base field name (e.g., 'name', 'description')
 * @param {string} language - Language code ('en' or 'ar')
 * @returns {string} Localized field value
 */
const getLocalizedField = (obj, fieldName, language = 'en') => {
  if (!obj) return '';
  
  // Try to get localized field first
  const localizedField = `${fieldName}_${language}`;
  if (obj[localizedField] !== undefined && obj[localizedField] !== null) {
    return obj[localizedField];
  }
  
  // Fallback to English if localized field doesn't exist
  const englishField = `${fieldName}_en`;
  if (obj[englishField] !== undefined && obj[englishField] !== null) {
    return obj[englishField];
  }
  
  // Fallback to base field name
  if (obj[fieldName] !== undefined && obj[fieldName] !== null) {
    return obj[fieldName];
  }
  
  return '';
};

/**
 * Get localized object with all localized fields
 * @param {Object} obj - Object containing localized fields
 * @param {Array} fields - Array of field names to localize
 * @param {string} language - Language code ('en' or 'ar')
 * @returns {Object} Object with localized field values
 */
const getLocalizedObject = (obj, fields = [], language = 'en') => {
  if (!obj) return {};
  
  const localized = {};
  
  fields.forEach(field => {
    localized[field] = getLocalizedField(obj, field, language);
  });
  
  return localized;
};

/**
 * Format localized response data
 * @param {Object} data - Response data object
 * @param {string} language - Language code ('en' or 'ar')
 * @param {Set} visited - Set to track visited objects for circular reference detection
 * @returns {Object} Formatted response data
 */
const formatLocalizedResponse = (data, language = 'en', visited = new Set()) => {
  if (!data) return data;
  
  // Handle Date objects - convert to ISO string
  if (data instanceof Date) {
    return data.toISOString();
  }
  
  // Handle arrays
  if (Array.isArray(data)) {
    return data.map(item => formatLocalizedResponse(item, language, visited));
  }
  
  // Handle objects
  if (typeof data === 'object') {
    // Check for circular references
    if (visited.has(data)) {
      return '[Circular Reference]';
    }
    visited.add(data);
    
    // For Sequelize models, convert to plain object first
    let plainData;
    if (data.toJSON && typeof data.toJSON === 'function') {
      plainData = data.toJSON();
    } else if (data.get && typeof data.get === 'function') {
      // Sequelize instance without toJSON but with get method
      plainData = { ...data.get({ plain: true }) };
    } else {
      plainData = data;
    }
    
    const formatted = {};
    
    // Process each field
    Object.keys(plainData).forEach(key => {
      const value = plainData[key];
      
      // Handle Date objects
      if (value instanceof Date) {
        formatted[key] = value.toISOString();
      }
      // Handle nested objects
      else if (typeof value === 'object' && value !== null) {
        formatted[key] = formatLocalizedResponse(value, language, visited);
      }
      else {
        formatted[key] = value;
      }
    });
    
    // Localize common fields that might have translations
    const localizableFields = ['name', 'description', 'title', 'message', 'address', 'bio', 'business_name'];
    
    localizableFields.forEach(field => {
      if (formatted[`${field}_en`] || formatted[`${field}_ar`]) {
        formatted[field] = getLocalizedField(formatted, field, language);
      }
    });
    
    visited.delete(data);
    return formatted;
  }
  
  return data;
};

module.exports = {
  languageMiddleware,
  getLocalizedField,
  getLocalizedObject,
  formatLocalizedResponse,
  supportedLanguages,
  defaultLanguage,
};
