/**
 * RTK Query base API with:
 *  - Cookie-based auth (credentials: 'include')
 *  - Automatic 401 → refresh token → retry flow
 *  - Backend envelope unwrapping ({ statusCode, result } → result)
 *  - Normalized error format
 */

import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type { ApiResponse, ApiError } from './apiTypes';
import { env } from '@/config/env';

const BASE_URL = env.API_BASE_URL || 'http://localhost:5000/api';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include', // send cookies (access + refresh tokens)
  prepareHeaders: (headers) => {
    // Cookies are sent automatically; no manual token injection needed
    return headers;
  },
});

/**
 * Mutex to prevent multiple concurrent refresh calls.
 */
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

const refreshAccessToken = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    return res.ok;
  } catch {
    return false;
  }
};

const ensureRefresh = (): Promise<boolean> => {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshPromise = refreshAccessToken().finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });
  }
  return refreshPromise!;
};

/**
 * Custom baseQuery that:
 *  1. Unwraps the backend envelope (result field)
 *  2. On 401, attempts a token refresh and retries once
 *  3. Normalizes errors into ApiError shape
 */
const baseQueryWithRefresh: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  // Handle 401 — attempt refresh and retry
  if (result.error && result.error.status === 401) {
    const refreshed = await ensureRefresh();
    if (refreshed) {
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  // Unwrap backend envelope on success
  if (result.data) {
    const envelope = result.data as ApiResponse;
    return { data: envelope.result };
  }

  // Normalize error
  if (result.error) {
    const serverBody = result.error.data as ApiResponse | undefined;
    const apiError: ApiError = {
      status: (result.error.status as number) || 500,
      exceptionCode: serverBody?.exceptionCode ?? null,
      message: serverBody?.statusMessage ?? 'An unexpected error occurred',
    };
    return {
      error: {
        status: apiError.status,
        data: apiError,
      } as FetchBaseQueryError,
    };
  }

  return result;
};

/**
 * Root RTK Query API. All feature-specific endpoints inject into this.
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithRefresh,
  tagTypes: [
    'User', 'Organizations', 'Teams', 'Channels',
    'Conversations', 'Messages', 'ThreadMessages',
    'ReadStates', 'Notifications', 'Members',
  ],
  endpoints: () => ({}),
});
