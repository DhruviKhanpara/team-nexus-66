/**
 * Chat API endpoints — RTK Query.
 */

import { baseApi } from './baseApi';
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
      providesTags: ['Organizations'],
    }),

    // ── Teams ─────────────────────────────────────────────
    getTeams: build.query<Team[], string>({
      query: (orgId) => `/organizations/${orgId}/teams`,
      providesTags: ['Teams'],
    }),

    createTeam: build.mutation<Team, { orgId: string; data: Partial<Team> }>({
      query: ({ orgId, data }) => ({ url: `/organizations/${orgId}/teams`, method: 'POST', body: data }),
      invalidatesTags: ['Teams'],
    }),

    // ── Channels ──────────────────────────────────────────
    getChannels: build.query<Channel[], string>({
      query: (teamId) => `/teams/${teamId}/channels`,
      providesTags: ['Channels'],
    }),

    createChannel: build.mutation<Channel, { teamId: string; data: Partial<Channel> }>({
      query: ({ teamId, data }) => ({ url: `/teams/${teamId}/channels`, method: 'POST', body: data }),
      invalidatesTags: ['Channels'],
    }),

    // ── Conversations ─────────────────────────────────────
    getConversations: build.query<Conversation[], string>({
      query: (orgId) => `/organizations/${orgId}/conversations`,
      providesTags: ['Conversations'],
    }),

    createConversation: build.mutation<Conversation, Partial<Conversation>>({
      query: (body) => ({ url: '/conversations', method: 'POST', body }),
      invalidatesTags: ['Conversations'],
    }),

    // ── Messages ──────────────────────────────────────────
    getMessages: build.query<Message[], { type: 'channel' | 'conversation'; id: string; before?: string }>({
      query: ({ type, id, before }) => {
        const base = type === 'channel' ? 'channels' : 'conversations';
        return `/${base}/${id}/messages${before ? `?before=${before}` : ''}`;
      },
      providesTags: (result, _err, { id }) =>
        result
          ? [...result.map((m) => ({ type: 'Messages' as const, id: m._id })), { type: 'Messages', id }]
          : [{ type: 'Messages', id }],
    }),

    sendMessage: build.mutation<Message, { type: 'channel' | 'conversation'; id: string; body: FormData | object }>({
      query: ({ type, id, body }) => ({
        url: `/${type === 'channel' ? 'channels' : 'conversations'}/${id}/messages`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: 'Messages', id }],
    }),

    editMessage: build.mutation<Message, { messageId: string; content: string }>({
      query: ({ messageId, content }) => ({ url: `/messages/${messageId}`, method: 'PATCH', body: { content } }),
      invalidatesTags: ['Messages'],
    }),

    deleteMessage: build.mutation<void, string>({
      query: (messageId) => ({ url: `/messages/${messageId}`, method: 'DELETE' }),
      invalidatesTags: ['Messages'],
    }),

    addReaction: build.mutation<Message, { messageId: string; emoji: string }>({
      query: ({ messageId, emoji }) => ({ url: `/messages/${messageId}/reactions`, method: 'POST', body: { emoji } }),
      invalidatesTags: ['Messages'],
    }),

    removeReaction: build.mutation<Message, { messageId: string; emoji: string }>({
      query: ({ messageId, emoji }) => ({ url: `/messages/${messageId}/reactions`, method: 'DELETE', body: { emoji } }),
      invalidatesTags: ['Messages'],
    }),

    // ── Threads ───────────────────────────────────────────
    getThreadMessages: build.query<Message[], string>({
      query: (threadId) => `/messages/${threadId}/thread`,
      providesTags: (result, _err, threadId) =>
        result
          ? [...result.map((m) => ({ type: 'ThreadMessages' as const, id: m._id })), { type: 'ThreadMessages', id: threadId }]
          : [{ type: 'ThreadMessages', id: threadId }],
    }),

    replyToThread: build.mutation<Message, { threadId: string; body: FormData | object }>({
      query: ({ threadId, body }) => ({ url: `/messages/${threadId}/thread`, method: 'POST', body }),
      invalidatesTags: (_res, _err, { threadId }) => [{ type: 'ThreadMessages', id: threadId }, 'Messages'],
    }),

    // ── Read States ───────────────────────────────────────
    getReadStates: build.query<ReadState[], void>({
      query: () => '/read-states',
      providesTags: ['ReadStates'],
    }),

    markAsRead: build.mutation<ReadState, { type: 'channel' | 'conversation'; id: string }>({
      query: ({ type, id }) => ({ url: `/read-states/${type}/${id}/read`, method: 'POST' }),
      invalidatesTags: ['ReadStates'],
    }),

    // ── Notifications ─────────────────────────────────────
    getNotifications: build.query<Notification[], void>({
      query: () => '/notifications',
      providesTags: ['Notifications'],
    }),

    markNotificationRead: build.mutation<void, string>({
      query: (id) => ({ url: `/notifications/${id}/read`, method: 'POST' }),
      invalidatesTags: ['Notifications'],
    }),

    markAllNotificationsRead: build.mutation<void, void>({
      query: () => ({ url: '/notifications/read-all', method: 'POST' }),
      invalidatesTags: ['Notifications'],
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
      providesTags: ['Members'],
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
