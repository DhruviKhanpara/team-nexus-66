/**
 * Auth use cases — framework-agnostic.
 *
 * Each use case:
 *  1. Calls the API layer
 *  2. Maps the response (DTO → internal model)
 *  3. Returns the result
 *
 * NO Redux dispatch, NO React hooks, NO validation (handled by Zod schemas in forms).
 * Components call use cases, then dispatch the result themselves.
 */

import { authApi } from '@/api/authApi';
import { mapUserDtoToUser } from './auth.mapper';
import type { LoginRequest, RegisterRequest } from './auth.types';
import type { User } from '@/types/user';

/**
 * Login use case.
 *
 * @returns The mapped User on success
 * @throws ApiError on failure
 */
export const loginUser = async (credentials: LoginRequest): Promise<User> => {
  const response = await authApi.login(credentials);
  return mapUserDtoToUser(response.user);
};

/**
 * Register use case.
 */
export const registerUser = async (data: RegisterRequest): Promise<User> => {
  const response = await authApi.register(data);
  return mapUserDtoToUser(response.user);
};

/**
 * Logout use case.
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await authApi.logout();
  } catch {
    // Even if server call fails, caller should still clear local state
  }
};
