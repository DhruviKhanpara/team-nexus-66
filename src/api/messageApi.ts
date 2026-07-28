/**
 * Channel message API endpoints — RTK Query.
 *
 * Mounted at /orgs/:orgId/teams/:teamId/channels/:channelId/messages
 */

import { baseApi } from "./baseApi";
import { TAGS } from "./tags";
import type {
  GetMessagesQueryDTO,
  MessageDTO,
  MessageListDTO,
  SendMessageDTO,
} from "@/types/message";

export interface ChannelMessagesArgs {
  orgId: string;
  teamId: string;
  channelId: string;
  query?: GetMessagesQueryDTO;
}

export interface SendChannelMessageArgs {
  orgId: string;
  teamId: string;
  channelId: string;
  body: SendMessageDTO;
}

const messagesUrl = (orgId: string, teamId: string, channelId: string) =>
  `/orgs/${orgId}/teams/${teamId}/channels/${channelId}/messages`;

const buildMessagesQueryString = (query: GetMessagesQueryDTO = {}): string => {
  const params = new URLSearchParams();

  if (query.pageSize !== undefined) params.set("pageSize", String(query.pageSize));
  if (query.beforeId) params.set("beforeId", query.beforeId);
  if (query.threadRootMessageId)
    params.set("threadRootMessageId", query.threadRootMessageId);

  const qs = params.toString();
  return qs ? `?${qs}` : "";
};

export const messageApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getChannelMessages: build.query<MessageListDTO, ChannelMessagesArgs>({
      query: ({ orgId, teamId, channelId, query }) =>
        `${messagesUrl(orgId, teamId, channelId)}${buildMessagesQueryString(query)}`,
      providesTags: (_res, _err, { channelId }) => [
        { type: TAGS.MESSAGES, id: channelId },
      ],
    }),

    sendChannelMessage: build.mutation<MessageDTO, SendChannelMessageArgs>({
      query: ({ orgId, teamId, channelId, body }) => ({
        url: messagesUrl(orgId, teamId, channelId),
        method: "POST",
        body,
      }),
      // Messages are inserted into Redux from the response; no refetch needed.
      extraOptions: { silentSuccess: true },
    }),
  }),
});

export const {
  useGetChannelMessagesQuery,
  useLazyGetChannelMessagesQuery,
  useSendChannelMessageMutation,
} = messageApi;
