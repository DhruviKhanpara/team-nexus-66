/**
 * Base API client — plain fetch wrapper.
 *
 * Responsibilities:
 *  - Provides a configured fetch function with base URL
 *  - Unwraps the backend's { statusCode, exceptionCode, statusMessage, result } envelope
 *  - Handles token refresh automatically on 401
 *  - Normalizes errors into ApiError shape
 *
 * This replaces RTK Query. All API modules use `apiClient` for HTTP calls.
 */

import type { ApiResponse, ApiError } from './apiTypes';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * Attempt to refresh the access token using the httpOnly refresh cookie.
 * Returns true if refresh succeeded, false otherwise.
 */
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

/**
 * Ensures only one refresh request is in-flight at a time.
 */
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

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

/**
 * Core fetch wrapper that:
 *  1. Sends requests with credentials (cookies)
 *  2. Unwraps the backend response envelope
 *  3. Retries once on 401 after refreshing the token
 *  4. Throws ApiError on failure
 */
export const apiClient = async <T = unknown>(
  url: string,
  options: RequestOptions = {},
): Promise<T> => {
  const doFetch = async (): Promise<Response> => {
    const { method = 'GET', body, headers = {} } = options;

    const fetchOptions: RequestInit = {
      method,
      credentials: 'include',
      headers: {
        ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...headers,
      },
    };

    if (body) {
      fetchOptions.body = body instanceof FormData ? body : JSON.stringify(body);
    }

    return fetch(`${BASE_URL}${url}`, fetchOptions);
  };

  let response = await doFetch();

  // On 401, try refreshing the token and retry once
  if (response.status === 401) {
    const refreshed = await ensureRefresh();
    if (refreshed) {
      response = await doFetch();
    }
  }

  // Parse response
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const serverBody = data as ApiResponse | null;
    const apiError: ApiError = {
      status: response.status,
      exceptionCode: serverBody?.exceptionCode ?? null,
      message: serverBody?.statusMessage ?? 'An unexpected error occurred',
    };
    throw apiError;
  }

  // Unwrap the envelope
  const envelope = data as ApiResponse<T>;
  return envelope.result;
};
