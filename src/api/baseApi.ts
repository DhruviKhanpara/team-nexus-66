/**
 * Base RTK Query API slice.
 *
 * Responsibilities:
 *  - Configures fetchBaseQuery with auth token injection
 *  - Unwraps the backend's standardized { statusCode, exceptionCode, statusMessage, result } envelope
 *  - Provides centralized error normalization so consumers always get ApiError
 *  - Declares all cache tag types in one place
 *
 * This file does NOT contain business logic or domain-specific endpoints.
 * Domain endpoints are injected via api/*.api.ts files.
 */

import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/app/store';
import type { ApiResponse, ApiError } from './apiTypes';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Raw fetchBaseQuery configured with auth header injection.
 */
const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include', // send httpOnly cookies (refresh token)
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

/**
 * Wrapper that:
 *  1. Delegates to rawBaseQuery
 *  2. On success → unwraps `result` from the envelope
 *  3. On error → normalizes into a consistent ApiError shape
 */
const baseQueryWithEnvelope: BaseQueryFn<string | FetchArgs, unknown, ApiError> = async (
  args,
  api,
  extraOptions,
) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    // The server may still send our envelope on 4xx/5xx
    const serverBody = result.error.data as ApiResponse | undefined;
    const apiError: ApiError = {
      status: typeof result.error.status === 'number' ? result.error.status : 500,
      exceptionCode: serverBody?.exceptionCode ?? null,
      message: serverBody?.statusMessage ?? 'An unexpected error occurred',
    };
    return { error: apiError };
  }

  // Unwrap the envelope so consumers get `result` directly
  const envelope = result.data as ApiResponse;
  return { data: envelope.result };
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithEnvelope,
  tagTypes: [
    'User',
    'UserStatus',
    'Organization',
    'Team',
    'Channel',
    'Conversation',
    'Message',
    'ReadState',
    'Notification',
    'PinnedMessage',
    'File',
    'Membership',
    'ThreadMessages',
  ],
  endpoints: () => ({}),
});
