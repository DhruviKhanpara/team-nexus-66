/**
 * Auth API — plain HTTP functions.
 *
 * No hooks, no Redux, no RTK Query.
 * Each function calls apiClient and returns typed data.
 */

import { apiClient } from './baseApi';
import type {
  LoginRequest,
  RegisterRequest,
  LoginResponseDto,
  RegisterResponseDto,
  UserDto,
  UserProfileDto,
} from '@/domain/auth/auth.types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const authApi = {
  login: (credentials: LoginRequest) =>
    apiClient<LoginResponseDto>('/auth/login', {
      method: 'POST',
      body: credentials,
    }),

  register: (data: RegisterRequest) =>
    apiClient<RegisterResponseDto>('/auth/register', {
      method: 'POST',
      body: data,
    }),

  registerWithInvite: (data: RegisterRequest & { inviteToken: string }) => {
    const { inviteToken, ...body } = data;
    return apiClient<RegisterResponseDto>(`/auth/register/${inviteToken}`, {
      method: 'POST',
      body,
    });
  },

  logout: () =>
    apiClient<void>('/auth/logout', { method: 'POST' }),

  forgotPassword: (data: { email: string }) =>
    apiClient<void>('/auth/forgot-password', {
      method: 'POST',
      body: data,
    }),

  resetPassword: (data: { email: string; otp: string; newPassword: string }) =>
    apiClient<void>('/auth/reset-password', {
      method: 'POST',
      body: data,
    }),

  getMyDetails: (checkParams: string) =>
    apiClient<UserDto>(`/users/me/${checkParams}`),

  getMyProfile: () =>
    apiClient<UserProfileDto>('/users/profile/me'),

  updateProfile: (data: { name?: string; bio?: string }) =>
    apiClient<{ user: UserDto }>('/users/profile', {
      method: 'PUT',
      body: data,
    }),

  updateAvatar: (data: FormData) =>
    apiClient<{ icon: string }>('/users/profile/avatar', {
      method: 'PUT',
      body: data,
    }),
};
