/**
 * Auth domain — pure business logic.
 *
 * Rules:
 *  - No API calls
 *  - No Redux
 *  - No side effects
 *  - Only pure functions for validation, transformation, and decision-making
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,30}$/;

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

/** Validate login form input */
export const validateLoginInput = (
  identifier: string,
  password: string,
): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!identifier.trim()) {
    errors.identifier = 'Email or username is required';
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

/** Validate registration form input */
export const validateRegisterInput = (
  name: string,
  username: string,
  email: string,
  password: string,
): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!name.trim()) {
    errors.name = 'Name is required';
  } else if (name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!username.trim()) {
    errors.username = 'Username is required';
  } else if (!USERNAME_REGEX.test(username)) {
    errors.username = 'Username must be 3-30 characters, alphanumeric or underscore';
  }

  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Invalid email format';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

/** Determine whether an identifier is an email or username */
export const isEmail = (identifier: string): boolean =>
  EMAIL_REGEX.test(identifier);

/** Check whether a user is authenticated based on auth state */
export const isAuthenticated = (token: string | null, user: unknown): boolean =>
  Boolean(token && user);
