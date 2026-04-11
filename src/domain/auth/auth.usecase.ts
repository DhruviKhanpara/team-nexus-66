/**
 * Auth domain — use cases.
 *
 * Each use case orchestrates a complete user-facing flow:
 *  1. Validate input (via auth.logic)
 *  2. Call API (via authApi)
 *  3. Map response (via auth.mapper)
 *  4. Dispatch state updates (via Redux)
 *
 * Use cases are consumed by hooks and components.
 * They are the ONLY place where API + logic + state interact.
 */

import type { AppDispatch } from '@/app/store';
import { setCredentials, logout as logoutAction } from '@/features/authSlice';
import { validateLoginInput, validateRegisterInput } from './auth.logic';
import { mapUserDtoToUser } from './auth.mapper';
import type { LoginRequest, RegisterRequest } from './auth.types';

/**
 * Login use case.
 *
 * @param credentials - { identifier, password }
 * @param loginMutation - RTK Query trigger function from useLoginMutation
 * @param dispatch - Redux dispatch
 * @returns The mapped User on success
 * @throws ValidationResult or ApiError on failure
 */
export const loginUser = async (
  credentials: LoginRequest,
  loginMutation: (body: LoginRequest) => { unwrap: () => Promise<{ user: { _id: string; name: string; username: string; email: string } }> },
  dispatch: AppDispatch,
) => {
  // Step 1: Validate
  const validation = validateLoginInput(credentials.identifier, credentials.password);
  if (!validation.valid) {
    throw validation;
  }

  // Step 2: Call API
  const response = await loginMutation(credentials).unwrap();

  // Step 3: Map DTO → internal model
  const user = mapUserDtoToUser(response.user);

  // Step 4: Update state
  // Note: tokens are managed via httpOnly cookies by the backend.
  // We store a marker token for the auth guard; the real auth is cookie-based.
  dispatch(setCredentials({ user, token: 'cookie-auth' }));

  return user;
};

/**
 * Register use case.
 */
export const registerUser = async (
  data: RegisterRequest,
  registerMutation: (body: RegisterRequest) => { unwrap: () => Promise<{ user: { _id: string; name: string; username: string; email: string } }> },
  dispatch: AppDispatch,
) => {
  // Step 1: Validate
  const validation = validateRegisterInput(data.name, data.username, data.email, data.password);
  if (!validation.valid) {
    throw validation;
  }

  // Step 2: Call API
  const response = await registerMutation(data).unwrap();

  // Step 3: Map DTO → internal model
  const user = mapUserDtoToUser(response.user);

  // Step 4: Update state
  dispatch(setCredentials({ user, token: 'cookie-auth' }));

  return user;
};

/**
 * Logout use case.
 */
export const logoutUser = async (
  logoutMutation: () => { unwrap: () => Promise<void> },
  dispatch: AppDispatch,
) => {
  try {
    await logoutMutation().unwrap();
  } catch {
    // Even if the server call fails, clear local state
  }
  dispatch(logoutAction());
};
