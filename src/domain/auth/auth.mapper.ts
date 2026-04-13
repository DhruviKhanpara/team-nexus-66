/**
 * Auth domain — DTO ↔ View Model mappers.
 */

import type { User } from '@/types/user';
import type { UserDto, UserProfileDto, UserViewModel } from '@/types/auth';

const getInitials = (name: string): string =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || '?';

/**
 * Map a login/register UserDto to the app's internal User model.
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
 * Map a profile DTO to a UserViewModel.
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
 * Map internal User type to UserViewModel.
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
