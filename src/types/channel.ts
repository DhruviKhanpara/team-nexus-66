/**
 * Channel types — DTOs (server response shapes) and VOs (UI-facing).
 *
 * Endpoints in scope (mounted under /orgs/:orgId/teams/:teamId/channels):
 *  - GET    /channels                        → paginated ChannelSummaryDTO
 *  - GET    /channels/:channelId             → ChannelDetailDTO
 *  - POST   /channels                        → null
 *  - PUT    /channels/:channelId             → null
 *  - POST   /channels/:channelId/archive     → null
 *  - POST   /channels/:channelId/unarchive   → null
 */

import type { PaginatedDTO, PaginatedVO } from "./team";

export type ChannelTypeValue = "text" | "announcement";

//#region Data Transfer Objects
export interface ChannelSummaryDTO {
  id: string;
  orgId: string;
  teamId: string;
  name: string;
  description: string | null;
  type: ChannelTypeValue;
  isPrivate: boolean;
  isArchived: boolean;
  archivedAt: string | null;
  createdAt: string;
  memberCount: number;
  role: string | null;
  isMuted: boolean | null;
  joinedAt: string | null;
  unreadCount: number;
  mentionCount: number;
}

export interface ChannelDetailDTO {
  id: string;
  orgId: string;
  teamId: string;
  name: string;
  description: string | null;
  type: ChannelTypeValue;
  isPrivate: boolean;
  isArchived: boolean;
  archivedAt: string | null;
  createdAt: string;
  memberCount: number;
}

export type ChannelsListDTO = PaginatedDTO<ChannelSummaryDTO>;

export interface GetChannelsQueryDTO {
  search?: string;
  isArchived?: boolean;
  includePrivate?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

export interface CreateChannelDTO {
  name: string;
  description?: string | null;
  type?: ChannelTypeValue;
  isPrivate?: boolean;
}

export interface UpdateChannelDTO {
  name: string;
  description?: string | null;
}
//#endregion

//#region Value Objects
export interface ChannelSummaryVO {
  id: string;
  orgId: string;
  teamId: string;
  name: string;
  description: string | null;
  type: ChannelTypeValue;
  isPrivate: boolean;
  isArchived: boolean;
  archivedAt: string | null;
  createdAt: string;
  memberCount: number;
  role: string | null;
  isMuted: boolean | null;
  joinedAt: string | null;
  unreadCount: number;
  mentionCount: number;
}

export interface ChannelDetailVO {
  id: string;
  orgId: string;
  teamId: string;
  name: string;
  description: string | null;
  type: ChannelTypeValue;
  isPrivate: boolean;
  isArchived: boolean;
  archivedAt: string | null;
  createdAt: string;
  memberCount: number;
}

export type ChannelsListVO = PaginatedVO<ChannelSummaryVO>;

export interface GetChannelsQueryVO {
  search?: string;
  isArchived?: boolean;
  includePrivate?: boolean;
  pageNumber?: number;
  pageSize?: number;
}
//#endregion
