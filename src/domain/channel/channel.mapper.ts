/**
 * Channel domain — DTO ↔ VO mappers.
 */

import type {
  ChannelSummaryDTO,
  ChannelSummaryVO,
  ChannelDetailDTO,
  ChannelDetailVO,
  ChannelsListDTO,
  ChannelsListVO,
} from "@/types/channel";

export const mapChannelSummaryDtoToVO = (
  dto: ChannelSummaryDTO,
): ChannelSummaryVO => ({
  id: dto.id,
  orgId: dto.orgId,
  teamId: dto.teamId,
  name: dto.name,
  description: dto.description,
  type: dto.type,
  isPrivate: dto.isPrivate,
  isArchived: dto.isArchived,
  archivedAt: dto.archivedAt,
  createdAt: dto.createdAt,
  memberCount: dto.memberCount,
  role: dto.role,
  isMuted: dto.isMuted,
  joinedAt: dto.joinedAt,
  unreadCount: dto.unreadCount ?? 0,
  mentionCount: dto.mentionCount ?? 0,
});

export const mapChannelDetailDtoToVO = (
  dto: ChannelDetailDTO,
): ChannelDetailVO => ({
  id: dto.id,
  orgId: dto.orgId,
  teamId: dto.teamId,
  name: dto.name,
  description: dto.description,
  type: dto.type,
  isPrivate: dto.isPrivate,
  isArchived: dto.isArchived,
  archivedAt: dto.archivedAt,
  createdAt: dto.createdAt,
  memberCount: dto.memberCount,
});

export const mapChannelsListDtoToVO = (
  dto: ChannelsListDTO,
): ChannelsListVO => ({
  data: dto.data.map(mapChannelSummaryDtoToVO),
  totalCount: dto.totalCount,
  pageNumber: dto.pageNumber,
  pageSize: dto.pageSize,
  totalPages: dto.totalPages,
  hasNextPage: dto.hasNextPage,
  hasPreviousPage: dto.hasPreviousPage,
});
