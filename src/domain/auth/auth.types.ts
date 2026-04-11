/**
 * Auth domain types.
 *
 * Separates:
 *  - DTOs: shapes coming from / going to the server
 *  - View Models: shapes consumed by UI components
 *  - Request types: payloads for API calls
 */

// ── DTOs (match backend response shapes exactly) ───────────────────────

/** User shape returned by login/register endpoints */
export interface UserDto {
  _id: string;
  name: string;
  username: string;
  email: string;
}

/** User profile shape returned by GET /users/profile/me */
export interface UserProfileDto {
  _id: string;
  name: string;
  avatar: string | null;
  bio: string | null;
  username?: string;
  email?: string;
  isEmailVerified?: boolean;
  createdAt?: string;
}

/** Login endpoint result (after envelope unwrap) */
export interface LoginResponseDto {
  user: UserDto;
}

/** Register endpoint result (after envelope unwrap) */
export interface RegisterResponseDto {
  user: UserDto;
  org?: {
    _id: string;
    name: string;
    slug: string;
  };
}

// ── Request types ──────────────────────────────────────────────────────

export interface LoginRequest {
  identifier: string;  // email or username
  password: string;
}

export interface RegisterRequest {
  name: string;
  username: string;
  email: string;
  password: string;
}

// ── View Models (used by UI components) ────────────────────────────────

export interface UserViewModel {
  _id: string;
  name: string;
  username: string;
  email: string;
  avatar: { url: string | null; publicId: string | null };
  bio: string | null;
  isEmailVerified: boolean;
  /** Derived field: initials from name, e.g. "JD" */
  initials: string;
}
