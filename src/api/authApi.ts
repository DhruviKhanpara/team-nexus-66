/**
 * Auth API endpoints.
 *
 * Pure HTTP call definitions — no business logic, no state management.
 * Maps to the backend's auth routes:
 *   POST /auth/login
 *   POST /auth/register
 *   POST /auth/register/:inviteToken
 *   POST /auth/refresh
 *   POST /auth/logout
 *   POST /auth/forgot-password
 *   POST /auth/reset-password
 *   GET  /users/me/:checkParams
 *   GET  /users/profile/me
 */

import { baseApi } from './baseApi';
import type { UserDto, LoginRequest, RegisterRequest, LoginResponseDto, RegisterResponseDto, UserProfileDto } from '@/domain/auth/auth.types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponseDto, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    register: builder.mutation<RegisterResponseDto, RegisterRequest>({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
    }),

    registerWithInvite: builder.mutation<RegisterResponseDto, RegisterRequest & { inviteToken: string }>({
      query: ({ inviteToken, ...data }) => ({
        url: `/auth/register/${inviteToken}`,
        method: 'POST',
        body: data,
      }),
    }),

    refreshToken: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),

    forgotPassword: builder.mutation<void, { email: string }>({
      query: (data) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),

    resetPassword: builder.mutation<void, { email: string; otp: string; newPassword: string }>({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),

    getMyDetails: builder.query<UserDto, string>({
      query: (checkParams) => `/users/me/${checkParams}`,
      providesTags: ['User'],
    }),

    getMyProfile: builder.query<UserProfileDto, void>({
      query: () => '/users/profile/me',
      providesTags: ['User'],
    }),

    updateProfile: builder.mutation<{ user: UserDto }, { name?: string; bio?: string }>({
      query: (data) => ({
        url: '/users/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    updateAvatar: builder.mutation<{ icon: string }, FormData>({
      query: (data) => ({
        url: '/users/profile/avatar',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRegisterWithInviteMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetMyDetailsQuery,
  useGetMyProfileQuery,
  useUpdateProfileMutation,
  useUpdateAvatarMutation,
} = authApi;
