/**
 * Team types — DTOs (server response shapes) and VOs (UI-facing).
 *
 * Endpoints in scope:
 *  - GET /orgs/:orgId/teams             → paginated TeamSummaryDTO
 *  - GET /orgs/:orgId/teams/:teamId     → TeamDetailDTO
 */

//#region Shared paginated envelope
export interface PaginatedDTO<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedVO<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
//#endregion

//#region Data Transfer Objects
export interface TeamSummaryDTO {
  id: string;
  orgId: string;
  name: string;
  description: string | null;
  icon: string | null;
  isPrivate: boolean;
  isArchived: boolean;
  archivedAt: string | null;
  createdAt: string;
  memberCount: number;
  role: string | null;
  isMuted: boolean | null;
  joinedAt: string | null;
}

export interface TeamDetailDTO {
  id: string;
  orgId: string;
  name: string;
  description: string | null;
  icon: { url: string | null; publicId: string | null } | null;
  isPrivate: boolean;
  isArchived: boolean;
  archivedAt: string | null;
  createdAt: string;
  memberCount: number;
}

export type TeamsListDTO = PaginatedDTO<TeamSummaryDTO>;

export interface GetTeamsQueryDTO {
  search?: string;
  isArchived?: boolean;
  includePrivate?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

export interface CreateTeamDTO {
  name: string;
  description?: string | null;
  isPrivate: boolean;
}

export interface UpdateTeamDTO {
  name: string;
  description?: string | null;
}
//#endregion

//#region Value Objects
export interface TeamSummaryVO {
  id: string;
  orgId: string;
  name: string;
  description: string | null;
  iconUrl: string | null;
  isPrivate: boolean;
  isArchived: boolean;
  archivedAt: string | null;
  createdAt: string;
  memberCount: number;
  role: string | null;
  isMuted: boolean | null;
  joinedAt: string | null;
}

export interface TeamDetailVO {
  id: string;
  orgId: string;
  name: string;
  description: string | null;
  iconUrl: string | null;
  isPrivate: boolean;
  isArchived: boolean;
  archivedAt: string | null;
  createdAt: string;
  memberCount: number;
}

export type TeamsListVO = PaginatedVO<TeamSummaryVO>;

export interface GetTeamsQueryVO {
  search?: string;
  isArchived?: boolean;
  includePrivate?: boolean;
  pageNumber?: number;
  pageSize?: number;
}
//#endregion
