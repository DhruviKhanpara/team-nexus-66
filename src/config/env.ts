/**
 * Centralized environment configuration.
 * All env vars must be accessed through this module — never read import.meta.env directly.
 */

const required = (key: string, value: string | undefined): string => {
  if (!value) {
    // eslint-disable-next-line no-console
    console.warn(`[env] Missing required env var: ${key}`);
    return '';
  }
  return value;
};

export const env = {
  API_BASE_URL: required('VITE_API_BASE_URL', import.meta.env.VITE_API_BASE_URL),
  SOCKET_URL: required('VITE_SOCKET_URL', import.meta.env.VITE_SOCKET_URL),
} as const;
