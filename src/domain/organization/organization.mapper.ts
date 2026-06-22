/**
 * Organization domain — DTO ↔ VO mappers.
 */

import type {
  OrgSummaryDTO,
  OrgSummaryVO,
  OrgDetailDTO,
  OrgDetailVO,
} from "@/types/organization";

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
