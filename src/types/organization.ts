/**
 * Organization types — DTOs (server response shapes) and VOs (UI-facing).
 *
 * Endpoints in scope:
 *  - GET /orgs/my        → OrgSummaryDTO[]
 *  - GET /orgs/:orgId    → OrgDetailDTO
 *
 * Legacy types (Membership, Channel) are kept here because other modules
 * (mock channels, chat) still import them from `@/types`.
 */

//#region Data Transfer Objects
export interface OrgSummaryDTO {
  id: string;
  name: string;
  slug: string;
  iconUrl: string | null;
  createdAt: string;
  role: string;
  joinedAt: string;
}

export interface OrgDetailDTO {
  id: string;
  name: string;
  slug: string;
  iconUrl: string | null;
  createdAt: string;
}
//#endregion

//#region Value Objects
export interface OrgSummaryVO {
  id: string;
  name: string;
  slug: string;
  iconUrl: string | null;
  createdAt: string;
  role: string;
  joinedAt: string;
}

export interface OrgDetailVO {
  id: string;
  name: string;
  slug: string;
  iconUrl: string | null;
  createdAt: string;
}
//#endregion

//#region Legacy types kept for channels / chat mock data
export type MembershipScope = "org" | "team" | "channel";
export type MembershipRole =
  | "OrgOwner"
  | "OrgAdmin"
  | "OrgMember"
  | "OrgGuest"
  | "TeamOwner"
  | "TeamMember"
  | "TeamGuest"
  | "ChannelModerator"
  | "ChannelMember";

export interface Membership {
  _id: string;
  userId: string;
  organizationId?: string;
  teamId?: string;
  channelId?: string;
  scope: MembershipScope;
  role: MembershipRole;
  invitedBy?: string;
  joinedAt: string;
}

export type ChannelType = "text" | "announcement";

export interface Channel {
  _id: string;
  name: string;
  description: string | null;
  teamId: string;
  organizationId: string;
  createdBy: string;
  type: ChannelType;
  isPrivate: boolean;
  isArchived: boolean;
  memberCount: number;
  lastActivityAt: string;
  createdAt: string;
}
//#endregion
