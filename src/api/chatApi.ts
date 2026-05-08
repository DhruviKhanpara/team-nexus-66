/**
 * Chat API endpoints — RTK Query.
 */

import { baseApi } from './baseApi';
import { TAGS } from './tags';
import type {
  Organization, Team, Channel, Conversation,
  Message, ReadState, Notification, PinnedMessage,
  UserStatus, Membership, FileAttachment,
} from '@/types';

export const chatApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ── Organizations ─────────────────────────────────────
    getOrganizations: build.query<Organization[], void>({
      query: () => '/organizations',
      providesTags: [TAGS.ORGANIZATIONS],
    }),

    // ── Teams ─────────────────────────────────────────────
    getTeams: build.query<Team[], string>({
      query: (orgId) => `/organizations/${orgId}/teams`,
      providesTags: [TAGS.TEAMS],
    }),

    createTeam: build.mutation<Team, { orgId: string; data: Partial<Team> }>({
      query: ({ orgId, data }) => ({ url: `/organizations/${orgId}/teams`, method: 'POST', body: data }),
      invalidatesTags: [TAGS.TEAMS],
    }),

    // ── Channels ──────────────────────────────────────────
    getChannels: build.query<Channel[], string>({
      query: (teamId) => `/teams/${teamId}/channels`,
      providesTags: [TAGS.CHANNELS],
    }),

    createChannel: build.mutation<Channel, { teamId: string; data: Partial<Channel> }>({
      query: ({ teamId, data }) => ({ url: `/teams/${teamId}/channels`, method: 'POST', body: data }),
      invalidatesTags: [TAGS.CHANNELS],
    }),

    // ── Conversations ─────────────────────────────────────
    getConversations: build.query<Conversation[], string>({
      query: (orgId) => `/organizations/${orgId}/conversations`,
      providesTags: [TAGS.CONVERSATIONS],
    }),

    createConversation: build.mutation<Conversation, Partial<Conversation>>({
      query: (body) => ({ url: '/conversations', method: 'POST', body }),
      invalidatesTags: [TAGS.CONVERSATIONS],
    }),

    // ── Messages ──────────────────────────────────────────
    getMessages: build.query<Message[], { type: 'channel' | 'conversation'; id: string; before?: string }>({
      query: ({ type, id, before }) => {
        const base = type === 'channel' ? 'channels' : 'conversations';
        return `/${base}/${id}/messages${before ? `?before=${before}` : ''}`;
      },
      providesTags: (result, _err, { id }) =>
        result
          ? [...result.map((m) => ({ type: TAGS.MESSAGES, id: m._id })), { type: TAGS.MESSAGES, id }]
          : [{ type: TAGS.MESSAGES, id }],
    }),

    sendMessage: build.mutation<Message, { type: 'channel' | 'conversation'; id: string; body: FormData | object }>({
      query: ({ type, id, body }) => ({
        url: `/${type === 'channel' ? 'channels' : 'conversations'}/${id}/messages`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: TAGS.MESSAGES, id }],
    }),

    editMessage: build.mutation<Message, { messageId: string; content: string }>({
      query: ({ messageId, content }) => ({ url: `/messages/${messageId}`, method: 'PATCH', body: { content } }),
      invalidatesTags: [TAGS.MESSAGES],
    }),

    deleteMessage: build.mutation<void, string>({
      query: (messageId) => ({ url: `/messages/${messageId}`, method: 'DELETE' }),
      invalidatesTags: [TAGS.MESSAGES],
    }),

    addReaction: build.mutation<Message, { messageId: string; emoji: string }>({
      query: ({ messageId, emoji }) => ({ url: `/messages/${messageId}/reactions`, method: 'POST', body: { emoji } }),
      invalidatesTags: [TAGS.MESSAGES],
    }),

    removeReaction: build.mutation<Message, { messageId: string; emoji: string }>({
      query: ({ messageId, emoji }) => ({ url: `/messages/${messageId}/reactions`, method: 'DELETE', body: { emoji } }),
      invalidatesTags: [TAGS.MESSAGES],
    }),

    // ── Threads ───────────────────────────────────────────
    getThreadMessages: build.query<Message[], string>({
      query: (threadId) => `/messages/${threadId}/thread`,
      providesTags: (result, _err, threadId) =>
        result
          ? [...result.map((m) => ({ type: TAGS.THREAD_MESSAGES, id: m._id })), { type: TAGS.THREAD_MESSAGES, id: threadId }]
          : [{ type: TAGS.THREAD_MESSAGES, id: threadId }],
    }),

    replyToThread: build.mutation<Message, { threadId: string; body: FormData | object }>({
      query: ({ threadId, body }) => ({ url: `/messages/${threadId}/thread`, method: 'POST', body }),
      invalidatesTags: (_res, _err, { threadId }) => [{ type: TAGS.THREAD_MESSAGES, id: threadId }, TAGS.MESSAGES],
    }),

    // ── Read States ───────────────────────────────────────
    getReadStates: build.query<ReadState[], void>({
      query: () => '/read-states',
      providesTags: [TAGS.READ_STATES],
    }),

    markAsRead: build.mutation<ReadState, { type: 'channel' | 'conversation'; id: string }>({
      query: ({ type, id }) => ({ url: `/read-states/${type}/${id}/read`, method: 'POST' }),
      invalidatesTags: [TAGS.READ_STATES],
    }),

    // ── Notifications ─────────────────────────────────────
    getNotifications: build.query<Notification[], void>({
      query: () => '/notifications',
      providesTags: [TAGS.NOTIFICATIONS],
    }),

    markNotificationRead: build.mutation<void, string>({
      query: (id) => ({ url: `/notifications/${id}/read`, method: 'POST' }),
      invalidatesTags: [TAGS.NOTIFICATIONS],
    }),

    markAllNotificationsRead: build.mutation<void, void>({
      query: () => ({ url: '/notifications/read-all', method: 'POST' }),
      invalidatesTags: [TAGS.NOTIFICATIONS],
    }),

    // ── Pinned Messages ───────────────────────────────────
    getPinnedMessages: build.query<PinnedMessage[], { type: 'channel' | 'conversation'; id: string }>({
      query: ({ type, id }) => `/${type === 'channel' ? 'channels' : 'conversations'}/${id}/pinned`,
    }),

    pinMessage: build.mutation<PinnedMessage, string>({
      query: (messageId) => ({ url: `/messages/${messageId}/pin`, method: 'POST' }),
    }),

    unpinMessage: build.mutation<void, string>({
      query: (pinId) => ({ url: `/pinned/${pinId}`, method: 'DELETE' }),
    }),

    // ── User Status ───────────────────────────────────────
    getUserStatuses: build.query<UserStatus[], string[]>({
      query: (userIds) => `/user-statuses?userIds=${userIds.join(',')}`,
    }),

    updateMyStatus: build.mutation<UserStatus, Partial<UserStatus>>({
      query: (body) => ({ url: '/user-statuses/me', method: 'PATCH', body }),
    }),

    // ── Members ───────────────────────────────────────────
    getMembers: build.query<Membership[], { scope: string; id: string }>({
      query: ({ scope, id }) => `/${scope}s/${id}/members`,
      providesTags: [TAGS.MEMBERS],
    }),

    // ── Files ─────────────────────────────────────────────
    getFiles: build.query<FileAttachment[], { type: 'channel' | 'conversation'; id: string }>({
      query: ({ type, id }) => `/${type === 'channel' ? 'channels' : 'conversations'}/${id}/files`,
    }),

    // ── Search ────────────────────────────────────────────
    searchMessages: build.query<Message[], { orgId: string; query: string }>({
      query: ({ orgId, query }) => `/organizations/${orgId}/search?q=${encodeURIComponent(query)}`,
    }),
  }),
});

export const {
  useGetOrganizationsQuery,
  useLazyGetOrganizationsQuery,
  useGetTeamsQuery,
  useLazyGetTeamsQuery,
  useCreateTeamMutation,
  useGetChannelsQuery,
  useLazyGetChannelsQuery,
  useCreateChannelMutation,
  useGetConversationsQuery,
  useLazyGetConversationsQuery,
  useCreateConversationMutation,
  useGetMessagesQuery,
  useLazyGetMessagesQuery,
  useSendMessageMutation,
  useEditMessageMutation,
  useDeleteMessageMutation,
  useAddReactionMutation,
  useRemoveReactionMutation,
  useGetThreadMessagesQuery,
  useLazyGetThreadMessagesQuery,
  useReplyToThreadMutation,
  useGetReadStatesQuery,
  useMarkAsReadMutation,
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useGetPinnedMessagesQuery,
  usePinMessageMutation,
  useUnpinMessageMutation,
  useGetUserStatusesQuery,
  useUpdateMyStatusMutation,
  useGetMembersQuery,
  useGetFilesQuery,
  useLazySearchMessagesQuery,
} = chatApi;
