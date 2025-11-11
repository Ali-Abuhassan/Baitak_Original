import { useTranslation } from 'react-i18next';

/**
 * Format a price value with the appropriate currency symbol
 * @param {number|string} price - The price value to format
 * @param {string} language - The current language (optional, defaults to current i18n language)
 * @returns {string} - Formatted price string
 */
export const formatCurrency = (price, language = null) => {
  const { i18n } = useTranslation();
  const currentLanguage = language || i18n.language;
  
  // Convert price to number if it's a string
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  // Check if price is valid
  if (isNaN(numericPrice)) {
    return '0.00';
  }
  
  // Format price with 2 decimal places
  const formattedPrice = numericPrice.toFixed(2);
  
  // Return formatted price with currency symbol based on language
  if (currentLanguage === 'ar') {
    return `${formattedPrice} دينار`;
  } else {
    return `${formattedPrice} JOD`;
  }
};

/**
 * Format a price value with currency symbol for display in components
 * This is a simpler version that doesn't require useTranslation hook
 * @param {number|string} price - The price value to format
 * @param {string} language - The current language (optional, defaults to 'en')
 * @returns {string} - Formatted price string
 */
export const formatPrice = (price, language = 'en') => {
  // Convert price to number if it's a string
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  // Check if price is valid
  if (isNaN(numericPrice)) {
    return '0.00';
  }
  
  // Format price with 2 decimal places
  const formattedPrice = numericPrice.toFixed(2);
  
  // Return formatted price with currency symbol based on language
  if (language === 'ar') {
    return `${formattedPrice} دينار`;
  } else {
    return `${formattedPrice} JOD`;
  }
};

/**
 * Get currency symbol based on language
 * @param {string} language - The current language (optional, defaults to 'en')
 * @returns {string} - Currency symbol
 */
export const getCurrencySymbol = (language = 'en') => {
  if (language === 'ar') {
    return 'دينار';
  } else {
    return 'JOD';
  }
};
