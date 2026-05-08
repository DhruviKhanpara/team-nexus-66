/**
 * Centralized RTK Query cache tag definitions.
 *
 * Always import tag identifiers from this module — never hardcode tag strings.
 */

export const TAGS = {
  USER: "User",
  ORGANIZATIONS: "Organizations",
  TEAMS: "Teams",
  CHANNELS: "Channels",
  CONVERSATIONS: "Conversations",
  MESSAGES: "Messages",
  THREAD_MESSAGES: "ThreadMessages",
  READ_STATES: "ReadStates",
  NOTIFICATIONS: "Notifications",
  MEMBERS: "Members",
  ME: "Me",
} as const;

export type AppTag = (typeof TAGS)[keyof typeof TAGS];

export const ALL_TAGS = Object.values(TAGS) as AppTag[];
