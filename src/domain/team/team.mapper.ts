/**
 * Team domain — DTO ↔ VO mappers.
 */

import type {
  TeamSummaryDTO,
  TeamSummaryVO,
  TeamDetailDTO,
  TeamDetailVO,
  TeamsListDTO,
  TeamsListVO,
} from "@/types/team";

export const mapTeamSummaryDtoToVO = (dto: TeamSummaryDTO): TeamSummaryVO => ({
  id: dto.id,
  orgId: dto.orgId,
  name: dto.name,
  description: dto.description,
  iconUrl: dto.icon,
  isPrivate: dto.isPrivate,
  isArchived: dto.isArchived,
  archivedAt: dto.archivedAt,
  createdAt: dto.createdAt,
  memberCount: dto.memberCount,
  role: dto.role,
  isMuted: dto.isMuted,
  joinedAt: dto.joinedAt,
});

export const mapTeamDetailDtoToVO = (dto: TeamDetailDTO): TeamDetailVO => ({
  id: dto.id,
  orgId: dto.orgId,
  name: dto.name,
  description: dto.description,
  iconUrl: dto.icon?.url ?? null,
  isPrivate: dto.isPrivate,
  isArchived: dto.isArchived,
  archivedAt: dto.archivedAt,
  createdAt: dto.createdAt,
  memberCount: dto.memberCount,
});

export const mapTeamsListDtoToVO = (dto: TeamsListDTO): TeamsListVO => ({
  data: dto.data.map(mapTeamSummaryDtoToVO),
  totalCount: dto.totalCount,
  pageNumber: dto.pageNumber,
  pageSize: dto.pageSize,
  totalPages: dto.totalPages,
  hasNextPage: dto.hasNextPage,
  hasPreviousPage: dto.hasPreviousPage,
});
