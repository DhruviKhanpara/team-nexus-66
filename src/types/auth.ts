/**
 * Auth types — DTOs, request types, view models.
 */

// ── DTOs (match backend response shapes exactly) ───────────────────────

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

export interface LoginResponseDto {
  user: UserDto;
}

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
  identifier: string;
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
  initials: string;
}
