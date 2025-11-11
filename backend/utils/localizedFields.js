/**
 * Utility functions for handling localized fields
 */

/**
 * Get localized field value based on language
 * @param {Object} model - The model instance
 * @param {string} fieldName - The base field name (e.g., 'name', 'description')
 * @param {string} language - The language code ('en' or 'ar')
 * @returns {string} - The localized field value
 */
const getLocalizedField = (model, fieldName, language = 'en') => {
  if (!model || !fieldName) {
    return '';
  }

  // Try to get the localized field first
  const localizedField = `${fieldName}_${language}`;
  if (model[localizedField] && model[localizedField].trim() !== '') {
    return model[localizedField];
  }

  // Fallback to the original field
  if (model[fieldName] && model[fieldName].trim() !== '') {
    return model[fieldName];
  }

  // Fallback to English if Arabic is requested but not available
  if (language === 'ar') {
    const englishField = `${fieldName}_en`;
    if (model[englishField] && model[englishField].trim() !== '') {
      return model[englishField];
    }
  }

  // Fallback to Arabic if English is requested but not available
  if (language === 'en') {
    const arabicField = `${fieldName}_ar`;
    if (model[arabicField] && model[arabicField].trim() !== '') {
      return model[arabicField];
    }
  }

  return '';
};

/**
 * Get all localized fields for a model
 * @param {Object} model - The model instance
 * @param {Array} fieldNames - Array of field names to localize
 * @param {string} language - The language code ('en' or 'ar')
 * @returns {Object} - Object with localized field values
 */
const getLocalizedFields = (model, fieldNames = [], language = 'en') => {
  const localizedFields = {};
  
  fieldNames.forEach(fieldName => {
    localizedFields[`${fieldName}_localized`] = getLocalizedField(model, fieldName, language);
  });
  
  return localizedFields;
};

/**
 * Add multilingual fields to a model object
 * @param {Object} model - The model instance
 * @param {Array} fieldNames - Array of field names to add multilingual support for
 * @returns {Object} - Object with multilingual fields added
 */
const addMultilingualFields = (model, fieldNames = []) => {
  const multilingualFields = {};
  
  fieldNames.forEach(fieldName => {
    multilingualFields[`${fieldName}_en`] = model[`${fieldName}_en`] || model[fieldName] || '';
    multilingualFields[`${fieldName}_ar`] = model[`${fieldName}_ar`] || model[fieldName] || '';
  });
  
  return multilingualFields;
};

module.exports = {
  getLocalizedField,
  getLocalizedFields,
  addMultilingualFields,
};

