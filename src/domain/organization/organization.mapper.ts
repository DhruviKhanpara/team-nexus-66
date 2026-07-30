/**
 * Organization domain — DTO ↔ VO mappers.
 */

import type {
  OrgSummaryDTO,
  OrgSummaryVO,
  OrgDetailDTO,
  OrgDetailVO,
  OrgMemberDTO,
  OrgMemberVO,
  OrgMembersListDTO,
  OrgMembersListVO,
} from "@/types/organization";

const UNKNOWN_NAME = "Unknown";

const toInitials = (value: string): string =>
  value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "?";

export const mapOrgSummaryDtoToVO = (dto: OrgSummaryDTO): OrgSummaryVO => ({
  id: dto.id,
  name: dto.name,
  slug: dto.slug,
  iconUrl: dto.iconUrl,
  createdAt: dto.createdAt,
  role: dto.role,
  joinedAt: dto.joinedAt,
});

export const mapOrgDetailDtoToVO = (dto: OrgDetailDTO): OrgDetailVO => ({
  id: dto.id,
  name: dto.name,
  slug: dto.slug,
  iconUrl: dto.iconUrl,
  createdAt: dto.createdAt,
});

export const mapOrgMemberDtoToVO = (dto: OrgMemberDTO): OrgMemberVO => {
  const name = dto.name ?? dto.username ?? UNKNOWN_NAME;
  return {
    membershipId: dto.membershipId,
    userId: dto.userId,
    name,
    username: dto.username ?? "",
    iconUrl: dto.iconUrl,
    initials: toInitials(name),
    role: dto.role,
    joinedAt: dto.joinedAt,
  };
};

export const mapOrgMembersListDtoToVO = (
  dto: OrgMembersListDTO | undefined,
): OrgMembersListVO => ({
  data: (dto?.data ?? []).map(mapOrgMemberDtoToVO),
  totalCount: dto?.totalCount ?? 0,
  pageNumber: dto?.pageNumber ?? 1,
  pageSize: dto?.pageSize ?? 0,
  totalPages: dto?.totalPages ?? 0,
  hasNextPage: dto?.hasNextPage ?? false,
  hasPreviousPage: dto?.hasPreviousPage ?? false,
});
