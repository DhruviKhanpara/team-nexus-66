/**
 * Re-usable helpers consumed by UI components.
 *
 * This file contains ONLY generic UI utilities.
 * Domain-specific logic (message grouping, conversation naming, etc.)
 * has been moved to the domain layer:
 *   - domain/chat/chat.logic.ts
 *   - domain/chat/chat.mapper.ts
 *   - domain/auth/auth.mapper.ts
 */

/** Extract initials from a user name (e.g., "John Doe" → "JD") */
export const getInitials = (name: string | undefined): string =>
  name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
