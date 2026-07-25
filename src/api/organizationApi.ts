/**
 * Organization API endpoints — RTK Query.
 */

import { baseApi } from "./baseApi";
import { TAGS } from "./tags";
import type {
  OrgSummaryDTO,
  OrgDetailDTO,
  CreateOrgDTO,
  CreateOrgResultDTO,
  UpdateOrgDTO,
} from "@/types/organization";

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

    createOrganization: build.mutation<CreateOrgResultDTO, CreateOrgDTO>({
      query: (body) => ({ url: "/orgs", method: "POST", body }),
      invalidatesTags: [TAGS.ORGANIZATIONS],
    }),

    updateOrganization: build.mutation<
      void,
      { orgId: string; body: UpdateOrgDTO }
    >({
      query: ({ orgId, body }) => ({
        url: `/orgs/${orgId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_res, _err, { orgId }) => [
        TAGS.ORGANIZATIONS,
        { type: TAGS.ORGANIZATIONS, id: orgId },
      ],
    }),
  }),
});

export const {
  useGetMyOrganizationsQuery,
  useGetOrganizationQuery,
  useCreateOrganizationMutation,
  useUpdateOrganizationMutation,
} = organizationApi;
