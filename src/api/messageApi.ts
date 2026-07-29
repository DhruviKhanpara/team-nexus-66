/**
 * Message API endpoints — RTK Query.
 *
 * Two transports, one message shape:
 *  - channels:      /orgs/:orgId/teams/:teamId/channels/:channelId/messages
 *  - conversations: /conversations/:conversationId/messages
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

export interface ConversationMessagesArgs {
  conversationId: string;
  query?: GetMessagesQueryDTO;
}

export interface SendConversationMessageArgs {
  conversationId: string;
  body: SendMessageDTO;
}

const messagesUrl = (orgId: string, teamId: string, channelId: string) =>
  `/orgs/${orgId}/teams/${teamId}/channels/${channelId}/messages`;

const conversationMessagesUrl = (conversationId: string) =>
  `/conversations/${conversationId}/messages`;

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

    getConversationMessages: build.query<
      MessageListDTO,
      ConversationMessagesArgs
    >({
      query: ({ conversationId, query }) =>
        `${conversationMessagesUrl(conversationId)}${buildMessagesQueryString(query)}`,
      providesTags: (_res, _err, { conversationId }) => [
        { type: TAGS.MESSAGES, id: conversationId },
      ],
    }),

    sendConversationMessage: build.mutation<
      MessageDTO,
      SendConversationMessageArgs
    >({
      query: ({ conversationId, body }) => ({
        url: conversationMessagesUrl(conversationId),
        method: "POST",
        body,
      }),
      extraOptions: { silentSuccess: true },
    }),
  }),
});

export const {
  useGetChannelMessagesQuery,
  useLazyGetChannelMessagesQuery,
  useSendChannelMessageMutation,
  useGetConversationMessagesQuery,
  useLazyGetConversationMessagesQuery,
  useSendConversationMessageMutation,
} = messageApi;
