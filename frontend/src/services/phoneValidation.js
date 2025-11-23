// Utility functions for Jordanian phone number validation and formatting

/**
 * Validates a Jordanian phone number
 * @param {string} phone - The phone number to validate
 * @returns {boolean} - True if valid Jordanian phone number
 */
export const validateJordanianPhone = (phone) => {
  if (!phone) return false;
  
  // Remove any non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Check if it's exactly 10 digits and starts with valid Jordanian mobile prefixes
  const validPrefixes = ['077', '078', '079'];
  return cleanPhone.length === 10 && validPrefixes.some(prefix => cleanPhone.startsWith(prefix));
};

/**
 * Formats a phone number for display (Jordanian format)
 * @param {string} value - The phone number to format
 * @returns {string} - Formatted phone number (0XX XXX XXXX)
 */
export const formatJordanianPhone = (value) => {
  if (!value) return '';
  
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');
  
  // If it starts with 962 (country code), remove it
  let phoneNumber = digits;
  if (digits.startsWith('962')) {
    phoneNumber = digits.substring(3);
  }
  
  // If it starts with 0, keep it
  if (phoneNumber.startsWith('0')) {
    // Format as: 0XX XXX XXXX
    if (phoneNumber.length <= 3) {
      return phoneNumber;
    } else if (phoneNumber.length <= 6) {
      return `${phoneNumber.substring(0, 3)} ${phoneNumber.substring(3)}`;
    } else if (phoneNumber.length <= 10) {
      return `${phoneNumber.substring(0, 3)} ${phoneNumber.substring(3, 6)} ${phoneNumber.substring(6)}`;
    } else {
      return `${phoneNumber.substring(0, 3)} ${phoneNumber.substring(3, 6)} ${phoneNumber.substring(6, 10)}`;
    }
  } else {
    // If it doesn't start with 0, add it
    const withZero = `0${phoneNumber}`;
    if (withZero.length <= 3) {
      return withZero;
    } else if (withZero.length <= 6) {
      return `${withZero.substring(0, 3)} ${withZero.substring(3)}`;
    } else if (withZero.length <= 10) {
      return `${withZero.substring(0, 3)} ${withZero.substring(3, 6)} ${withZero.substring(6)}`;
    } else {
      return `${withZero.substring(0, 3)} ${withZero.substring(3, 6)} ${withZero.substring(6, 10)}`;
    }
  }
};

/**
 * Converts a Jordanian phone number to international format for API calls
 * @param {string} phone - The phone number to convert
 * @returns {string} - Phone number in international format (+962XXXXXXXXX)
 */
export const toInternationalFormat = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // If it already starts with 962, return with +
  if (digits.startsWith('962')) {
    return `+${digits}`;
  }
  
  // If it starts with 0, replace with +962
  if (digits.startsWith('0')) {
    return `+962${digits.substring(1)}`;
  }
  
  // If it's 9 digits, add +962
  if (digits.length === 9) {
    return `+962${digits}`;
  }
  
  // If it's 10 digits and doesn't start with 0, assume it's already in the right format
  if (digits.length === 10) {
    return `+962${digits}`;
  }
  
  // Default: add +962
  return `+962${digits}`;
};

/**
 * Gets the clean phone number (digits only) for storage
 * @param {string} phone - The phone number to clean
 * @returns {string} - Clean phone number (10 digits starting with 0)
 */
export const getCleanPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // If it starts with 962 (country code), remove it
  let phoneNumber = digits;
  if (digits.startsWith('962')) {
    phoneNumber = digits.substring(3);
  }
  
  // Ensure it starts with 0
  if (!phoneNumber.startsWith('0')) {
    phoneNumber = `0${phoneNumber}`;
  }
  
  return phoneNumber;
};

