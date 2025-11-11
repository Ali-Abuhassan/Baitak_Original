/**
 * Normalize phone number to Jordan format (+962XXXXXXXXX)
 * Handles various formats:
 * - 0775633634 -> +962775633634
 * - 962775633634 -> +962775633634
 * - +962775633634 -> +962775633634
 * - 775633634 -> +962775633634 (assumes first digit is 7)
 * 
 * @param {string} phone - Phone number in any format
 * @returns {string} - Normalized phone number with +962 prefix
 */
function normalizePhoneNumber(phone) {
  if (!phone) return phone;
  
  // Remove all whitespace, dashes, and parentheses
  let normalized = phone.toString().trim().replace(/[\s\-\(\)]/g, '');
  
  // If already in correct format, return as is
  if (normalized.startsWith('+962')) {
    return normalized;
  }
  
  // If starts with 962 (without +), add +
  if (normalized.startsWith('962')) {
    return `+${normalized}`;
  }
  
  // If starts with 0 (Jordan local format), replace with +962
  if (normalized.startsWith('0')) {
    return `+962${normalized.substring(1)}`;
  }
  
  // If it's just 9 digits starting with 7, assume it's a Jordan mobile and add +962
  if (normalized.length === 9 && normalized.startsWith('7')) {
    return `+962${normalized}`;
  }
  
  // If it's 10 digits starting with 07, replace 0 with +962
  if (normalized.length === 10 && normalized.startsWith('07')) {
    return `+962${normalized.substring(1)}`;
  }
  
  // If it doesn't start with +, assume it's a local number and try to normalize
  // This handles edge cases
  if (!normalized.startsWith('+')) {
    // If starts with 7 and is 9 digits, add +962
    if (normalized.startsWith('7') && normalized.length === 9) {
      return `+962${normalized}`;
    }
    // If starts with 0 and is 10 digits, replace 0 with +962
    if (normalized.startsWith('0') && normalized.length === 10) {
      return `+962${normalized.substring(1)}`;
    }
  }
  
  // If we can't determine, return as is (might be international format already)
  return phone;
}

module.exports = {
  normalizePhoneNumber,
};

