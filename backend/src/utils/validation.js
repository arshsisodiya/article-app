/**
 * Input validation utilities.
 *
 * Provides reusable validation functions used across routes
 * to ensure data integrity before processing requests.
 */

/**
 * Validates an email address against a basic pattern.
 * Checks for: non-whitespace before @, non-whitespace after @, and a dot extension.
 *
 * @param {string} email - The email address to validate.
 * @returns {boolean} True if the email matches the expected pattern.
 */
function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

/**
 * Validates a password against strength rules.
 *
 * Rules enforced:
 *   - Minimum 8 characters
 *   - At least one lowercase letter
 *   - At least one uppercase letter
 *   - At least one digit
 *   - At least one special character
 *
 * @param {string} password - The password to validate.
 * @returns {{ valid: boolean, rules: object }} Validation result with per-rule breakdown.
 */
function passwordRulesCheck(password) {
  const minLength = password.length >= 8;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const valid = minLength && hasLowercase && hasUppercase && hasNumber && hasSpecial;

  return {
    valid,
    rules: {
      minLength,
      hasLowercase,
      hasUppercase,
      hasNumber,
      hasSpecial,
    },
  };
}

module.exports = {
  isValidEmail,
  passwordRulesCheck,
};
