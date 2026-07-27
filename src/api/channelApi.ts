/**
 * Channel API endpoints — RTK Query.
 *
 * Mounted under the team route as /orgs/:orgId/teams/:teamId/channels.
 */

import { baseApi } from "./baseApi";
import { TAGS } from "./tags";
import type {
  ChannelDetailDTO,
  ChannelsListDTO,
  GetChannelsQueryDTO,
  CreateChannelDTO,
  UpdateChannelDTO,
} from "@/types/channel";

interface GetChannelsArgs {
  orgId: string;
  teamId: string;
  query?: GetChannelsQueryDTO;
}

interface ChannelIdArgs {
  orgId: string;
  teamId: string;
  channelId: string;
}

interface CreateChannelArgs {
  orgId: string;
  teamId: string;
  body: CreateChannelDTO;
}

interface UpdateChannelArgs extends ChannelIdArgs {
  body: UpdateChannelDTO;
}

const buildChannelsQueryString = (query: GetChannelsQueryDTO = {}): string => {
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

const channelsUrl = (orgId: string, teamId: string) =>
  `/orgs/${orgId}/teams/${teamId}/channels`;

export const channelApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getChannels: build.query<ChannelsListDTO, GetChannelsArgs>({
      query: ({ orgId, teamId, query }) =>
        `${channelsUrl(orgId, teamId)}${buildChannelsQueryString(query)}`,
      providesTags: (_res, _err, { teamId }) => [
        { type: TAGS.CHANNELS, id: teamId },
      ],
    }),

    getChannel: build.query<ChannelDetailDTO, ChannelIdArgs>({
      query: ({ orgId, teamId, channelId }) =>
        `${channelsUrl(orgId, teamId)}/${channelId}`,
      providesTags: (_res, _err, { channelId }) => [
        { type: TAGS.CHANNELS, id: channelId },
      ],
    }),

    createChannel: build.mutation<void, CreateChannelArgs>({
      query: ({ orgId, teamId, body }) => ({
        url: channelsUrl(orgId, teamId),
        method: "POST",
        body,
      }),
      invalidatesTags: (_res, _err, { teamId }) => [
        { type: TAGS.CHANNELS, id: teamId },
      ],
    }),

    updateChannel: build.mutation<void, UpdateChannelArgs>({
      query: ({ orgId, teamId, channelId, body }) => ({
        url: `${channelsUrl(orgId, teamId)}/${channelId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_res, _err, { teamId, channelId }) => [
        { type: TAGS.CHANNELS, id: teamId },
        { type: TAGS.CHANNELS, id: channelId },
      ],
    }),

    archiveChannel: build.mutation<void, ChannelIdArgs>({
      query: ({ orgId, teamId, channelId }) => ({
        url: `${channelsUrl(orgId, teamId)}/${channelId}/archive`,
        method: "POST",
      }),
      invalidatesTags: (_res, _err, { teamId, channelId }) => [
        { type: TAGS.CHANNELS, id: teamId },
        { type: TAGS.CHANNELS, id: channelId },
      ],
    }),

    unarchiveChannel: build.mutation<void, ChannelIdArgs>({
      query: ({ orgId, teamId, channelId }) => ({
        url: `${channelsUrl(orgId, teamId)}/${channelId}/unarchive`,
        method: "POST",
      }),
      invalidatesTags: (_res, _err, { teamId, channelId }) => [
        { type: TAGS.CHANNELS, id: teamId },
        { type: TAGS.CHANNELS, id: channelId },
      ],
    }),
  }),
});

export const {
  useGetChannelsQuery,
  useGetChannelQuery,
  useCreateChannelMutation,
  useUpdateChannelMutation,
  useArchiveChannelMutation,
  useUnarchiveChannelMutation,
} = channelApi;
