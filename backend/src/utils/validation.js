function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

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
