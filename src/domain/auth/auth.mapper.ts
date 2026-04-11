/**
 * Auth domain — DTO ↔ View Model mappers.
 *
 * Transforms server responses (DTOs) into UI-ready view models,
 * and vice-versa for request payloads.
 *
 * Rules:
 *  - No API calls
 *  - No Redux
 *  - Pure transformation functions
 */

import type { User } from '@/types/user';
import type { UserDto, UserProfileDto, UserViewModel } from './auth.types';

/** Extract initials from a display name (e.g. "John Doe" → "JD") */
const getInitials = (name: string): string =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || '?';

/**
 * Map a login/register UserDto to the app's internal User model.
 *
 * The backend login/register endpoints return a minimal user shape
 * (no avatar, no organizationIds). This mapper fills in defaults
 * so the rest of the app can work with a complete User object.
 */
export const mapUserDtoToUser = (dto: UserDto): User => ({
  _id: dto._id,
  name: dto.name,
  email: dto.email,
  avatar: { url: null, publicId: null },
  organizationIds: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

/**
 * Map a UserDto to a fully enriched UserViewModel for the UI.
 */
export const mapUserDtoToViewModel = (dto: UserDto): UserViewModel => ({
  _id: dto._id,
  name: dto.name,
  username: dto.username,
  email: dto.email,
  avatar: { url: null, publicId: null },
  bio: null,
  isEmailVerified: false,
  initials: getInitials(dto.name),
});

/**
 * Map a profile DTO (from GET /users/profile/me) to a UserViewModel.
 */
export const mapProfileDtoToViewModel = (dto: UserProfileDto): UserViewModel => ({
  _id: dto._id,
  name: dto.name,
  username: dto.username ?? '',
  email: dto.email ?? '',
  avatar: { url: dto.avatar, publicId: null },
  bio: dto.bio,
  isEmailVerified: dto.isEmailVerified ?? false,
  initials: getInitials(dto.name),
});

/**
 * Map the internal User type to a UserViewModel for components
 * that already have a User from Redux state.
 */
export const mapUserToViewModel = (user: User): UserViewModel => ({
  _id: user._id,
  name: user.name,
  username: '',
  email: user.email,
  avatar: user.avatar,
  bio: null,
  isEmailVerified: false,
  initials: getInitials(user.name),
});
