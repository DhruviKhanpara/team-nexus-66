/**
 * Team API endpoints — RTK Query.
 *
 * Mounted under organization route as /orgs/:orgId/teams.
 */

import { baseApi } from "./baseApi";
import { TAGS } from "./tags";
import type {
  TeamDetailDTO,
  TeamsListDTO,
  GetTeamsQueryDTO,
} from "@/types/team";

interface GetTeamsArgs {
  orgId: string;
  query?: GetTeamsQueryDTO;
}

interface GetTeamArgs {
  orgId: string;
  teamId: string;
}

const buildTeamsQueryString = (query: GetTeamsQueryDTO = {}): string => {
  const params = new URLSearchParams();

  if (query.search !== undefined) params.set("search", query.search);
  if (query.isArchived !== undefined)
    params.set("isArchived", String(query.isArchived));
  if (query.includePrivate !== undefined)
    params.set("includePrivate", String(query.includePrivate));
  if (query.pageNumber !== undefined)
    params.set("pageNumber", String(query.pageNumber));
  if (query.pageSize !== undefined)
    params.set("pageSize", String(query.pageSize));

  const qs = params.toString();
  return qs ? `?${qs}` : "";
};

export const teamApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTeams: build.query<TeamsListDTO, GetTeamsArgs>({
      query: ({ orgId, query }) =>
        `/orgs/${orgId}/teams${buildTeamsQueryString(query)}`,
      providesTags: (_res, _err, { orgId }) => [
        { type: TAGS.TEAMS, id: orgId },
      ],
    }),

    getTeam: build.query<TeamDetailDTO, GetTeamArgs>({
      query: ({ orgId, teamId }) => `/orgs/${orgId}/teams/${teamId}`,
      providesTags: (_res, _err, { teamId }) => [
        { type: TAGS.TEAMS, id: teamId },
      ],
    }),
  }),
});

export const { useGetTeamsQuery, useGetTeamQuery } = teamApi;
