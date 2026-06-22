/**
 * Organization API endpoints — RTK Query.
 */

import { baseApi } from "./baseApi";
import { TAGS } from "./tags";
import type { OrgSummaryDTO, OrgDetailDTO } from "@/types/organization";

export const organizationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMyOrganizations: build.query<OrgSummaryDTO[], void>({
      query: () => "/orgs/my",
      providesTags: [TAGS.ORGANIZATIONS],
    }),

    getOrganization: build.query<OrgDetailDTO, string>({
      query: (orgId) => `/orgs/${orgId}`,
      providesTags: (_res, _err, orgId) => [
        { type: TAGS.ORGANIZATIONS, id: orgId },
      ],
    }),
  }),
});

export const { useGetMyOrganizationsQuery, useGetOrganizationQuery } =
  organizationApi;
