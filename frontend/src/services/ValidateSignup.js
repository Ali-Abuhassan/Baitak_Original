export const validateSignup = (data) => {
  const errors = {};

  // First name
  if (!data.first_name || data.first_name.trim() === "") {
    errors.first_name = "First name is required";
  }

  // Last name
  if (!data.last_name || data.last_name.trim() === "") {
    errors.last_name = "Last name is required";
  }

  // Phone (Jordan only)
  const jordanPhoneRegex = /^(079|078|077)\d{6,7}$/;
  if (!jordanPhoneRegex.test(data.phone)) {
    errors.phone = "Invalid Jordanian phone number";
  }

  // Password
  if (!data.password || data.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  // Confirm Password
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  // City
  if (!data.city) {
    errors.city = "City is required";
  }

  // Area
  if (!data.area) {
    errors.area = "Area is required";
  }

  return errors;
};
