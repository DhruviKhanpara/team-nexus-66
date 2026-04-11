/**
 * Standardized API response shape matching the backend's sendResponse() utility.
 *
 * Every HTTP response from the server wraps its payload in this envelope:
 *   { statusCode, exceptionCode, statusMessage, result }
 *
 * RTK Query's transformResponse should unwrap `result` so the rest of the app
 * never deals with transport-level concerns.
 */

export interface ApiResponse<T = unknown> {
  statusCode: number;
  exceptionCode: string | null;
  statusMessage: string;
  result: T;
}

/**
 * Normalized error shape used throughout the app.
 * Created by the centralized error handler in baseApi.
 */
export interface ApiError {
  status: number;
  exceptionCode: string | null;
  message: string;
}
