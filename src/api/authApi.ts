/**
 * Auth API endpoints — RTK Query.
 */

import { baseApi } from './baseApi';
import type {
  LoginRequest,
  RegisterRequest,
  LoginResponseDto,
  RegisterResponseDto,
  UserDto,
  UserProfileDto,
} from '@/types/auth';

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResponseDto, LoginRequest>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      invalidatesTags: ['User'],
    }),

    register: build.mutation<RegisterResponseDto, RegisterRequest>({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
    }),

    registerWithInvite: build.mutation<RegisterResponseDto, RegisterRequest & { inviteToken: string }>({
      query: ({ inviteToken, ...body }) => ({
        url: `/auth/register/${inviteToken}`,
        method: 'POST',
        body,
      }),
    }),

    logout: build.mutation<void, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
      invalidatesTags: ['User'],
    }),

    forgotPassword: build.mutation<void, { email: string }>({
      query: (body) => ({ url: '/auth/forgot-password', method: 'POST', body }),
    }),

    resetPassword: build.mutation<void, { email: string; otp: string; newPassword: string }>({
      query: (body) => ({ url: '/auth/reset-password', method: 'POST', body }),
    }),

    getMyDetails: build.query<UserDto, string>({
      query: (checkParams) => `/users/me/${checkParams}`,
      providesTags: ['User'],
    }),

    getMyProfile: build.query<UserProfileDto, void>({
      query: () => '/users/profile/me',
      providesTags: ['User'],
    }),

    updateProfile: build.mutation<{ user: UserDto }, { name?: string; bio?: string }>({
      query: (body) => ({ url: '/users/profile', method: 'PUT', body }),
      invalidatesTags: ['User'],
    }),

    updateAvatar: build.mutation<{ icon: string }, FormData>({
      query: (body) => ({ url: '/users/profile/avatar', method: 'PUT', body }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetMyDetailsQuery,
  useLazyGetMyDetailsQuery,
  useGetMyProfileQuery,
  useLazyGetMyProfileQuery,
  useUpdateProfileMutation,
  useUpdateAvatarMutation,
} = authApi;
