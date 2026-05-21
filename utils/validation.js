/**
 * Tiny field-level validators used by the auth/profile forms.
 * Each validator returns an error string or null.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const validators = {
  required(value, label = "This field") {
    if (value === undefined || value === null) return `${label} is required`;
    if (typeof value === "string" && value.trim() === "") return `${label} is required`;
    return null;
  },

  name(value) {
    const req = validators.required(value, "Name");
    if (req) return req;
    if (value.trim().length < 2) return "Name must be at least 2 characters";
    if (value.trim().length > 60) return "Name must be under 60 characters";
    return null;
  },

  email(value) {
    const req = validators.required(value, "Email");
    if (req) return req;
    if (!EMAIL_RE.test(value.trim())) return "Enter a valid email address";
    return null;
  },

  address(value) {
    const req = validators.required(value, "Address");
    if (req) return req;
    if (value.trim().length < 5) return "Address must be at least 5 characters";
    return null;
  },

  password(value) {
    const req = validators.required(value, "Password");
    if (req) return req;
    if (value.length < 6) return "Password must be at least 6 characters";
    if (!/[A-Za-z]/.test(value) || !/\d/.test(value))
      return "Password must include a letter and a number";
    return null;
  },

  loginPassword(value) {
    return validators.required(value, "Password");
  },
};

/**
 * Run a map of field validators. Returns { isValid, errors }.
 * @param {Record<string, any>} values
 * @param {Record<string, (value:any) => string|null>} schema
 */
export function validateForm(values, schema) {
  const errors = {};
  for (const key of Object.keys(schema)) {
    const fn = schema[key];
    const error = fn(values[key]);
    if (error) errors[key] = error;
  }
  return { isValid: Object.keys(errors).length === 0, errors };
}
