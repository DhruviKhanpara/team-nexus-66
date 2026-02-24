import { baseApi } from './baseApi';
import type {
  Team, Channel, Conversation, Message, ReadState,
  Notification, PinnedMessage, UserStatus, Membership,
  Organization, FileAttachment,
} from '@/types';

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Organizations
    getOrganizations: builder.query<Organization[], void>({
      query: () => '/organizations',
      providesTags: ['Organization'],
    }),

    // Teams
    getTeams: builder.query<Team[], string>({
      query: (orgId) => `/organizations/${orgId}/teams`,
      providesTags: ['Team'],
    }),
    createTeam: builder.mutation<Team, { orgId: string; data: Partial<Team> }>({
      query: ({ orgId, data }) => ({
        url: `/organizations/${orgId}/teams`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Team'],
    }),

    // Channels
    getChannels: builder.query<Channel[], string>({
      query: (teamId) => `/teams/${teamId}/channels`,
      providesTags: ['Channel'],
    }),
    createChannel: builder.mutation<Channel, { teamId: string; data: Partial<Channel> }>({
      query: ({ teamId, data }) => ({
        url: `/teams/${teamId}/channels`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Channel'],
    }),

    // Conversations
    getConversations: builder.query<Conversation[], string>({
      query: (orgId) => `/organizations/${orgId}/conversations`,
      providesTags: ['Conversation'],
    }),
    createConversation: builder.mutation<Conversation, Partial<Conversation>>({
      query: (data) => ({
        url: '/conversations',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Conversation'],
    }),

    // Messages
    getMessages: builder.query<Message[], { type: 'channel' | 'conversation'; id: string; before?: string }>({
      query: ({ type, id, before }) => ({
        url: type === 'channel' ? `/channels/${id}/messages` : `/conversations/${id}/messages`,
        params: before ? { before } : undefined,
      }),
      providesTags: ['Message'],
    }),
    sendMessage: builder.mutation<Message, { type: 'channel' | 'conversation'; id: string; data: FormData | object }>({
      query: ({ type, id, data }) => ({
        url: type === 'channel' ? `/channels/${id}/messages` : `/conversations/${id}/messages`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Message', 'ReadState', 'Conversation'],
    }),
    editMessage: builder.mutation<Message, { messageId: string; content: string }>({
      query: ({ messageId, content }) => ({
        url: `/messages/${messageId}`,
        method: 'PATCH',
        body: { content },
      }),
      invalidatesTags: ['Message'],
    }),
    deleteMessage: builder.mutation<void, string>({
      query: (messageId) => ({
        url: `/messages/${messageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Message'],
    }),
    addReaction: builder.mutation<Message, { messageId: string; emoji: string }>({
      query: ({ messageId, emoji }) => ({
        url: `/messages/${messageId}/reactions`,
        method: 'POST',
        body: { emoji },
      }),
      invalidatesTags: ['Message'],
    }),
    removeReaction: builder.mutation<Message, { messageId: string; emoji: string }>({
      query: ({ messageId, emoji }) => ({
        url: `/messages/${messageId}/reactions`,
        method: 'DELETE',
        body: { emoji },
      }),
      invalidatesTags: ['Message'],
    }),

    // Thread messages
    getThreadMessages: builder.query<Message[], string>({
      query: (threadId) => `/messages/${threadId}/thread`,
      providesTags: ['ThreadMessages'],
    }),
    replyToThread: builder.mutation<Message, { threadId: string; data: FormData | object }>({
      query: ({ threadId, data }) => ({
        url: `/messages/${threadId}/thread`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ThreadMessages', 'Message'],
    }),

    // Read State
    getReadStates: builder.query<ReadState[], void>({
      query: () => '/read-states',
      providesTags: ['ReadState'],
    }),
    markAsRead: builder.mutation<ReadState, { type: 'channel' | 'conversation'; id: string }>({
      query: ({ type, id }) => ({
        url: `/read-states/${type}/${id}/read`,
        method: 'POST',
      }),
      invalidatesTags: ['ReadState'],
    }),

    // Notifications
    getNotifications: builder.query<Notification[], void>({
      query: () => '/notifications',
      providesTags: ['Notification'],
    }),
    markNotificationRead: builder.mutation<void, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'POST',
      }),
      invalidatesTags: ['Notification'],
    }),
    markAllNotificationsRead: builder.mutation<void, void>({
      query: () => ({
        url: '/notifications/read-all',
        method: 'POST',
      }),
      invalidatesTags: ['Notification'],
    }),

    // Pinned Messages
    getPinnedMessages: builder.query<PinnedMessage[], { type: 'channel' | 'conversation'; id: string }>({
      query: ({ type, id }) => `/${type === 'channel' ? 'channels' : 'conversations'}/${id}/pinned`,
      providesTags: ['PinnedMessage'],
    }),
    pinMessage: builder.mutation<PinnedMessage, { messageId: string }>({
      query: ({ messageId }) => ({
        url: `/messages/${messageId}/pin`,
        method: 'POST',
      }),
      invalidatesTags: ['PinnedMessage'],
    }),
    unpinMessage: builder.mutation<void, string>({
      query: (pinId) => ({
        url: `/pinned/${pinId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PinnedMessage'],
    }),

    // User Status
    getUserStatuses: builder.query<UserStatus[], string[]>({
      query: (userIds) => ({
        url: '/user-statuses',
        params: { userIds: userIds.join(',') },
      }),
      providesTags: ['UserStatus'],
    }),
    updateMyStatus: builder.mutation<UserStatus, Partial<UserStatus>>({
      query: (data) => ({
        url: '/user-statuses/me',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['UserStatus'],
    }),

    // Members
    getMembers: builder.query<Membership[], { scope: string; id: string }>({
      query: ({ scope, id }) => `/${scope}s/${id}/members`,
      providesTags: ['Membership'],
    }),

    // Files
    getFiles: builder.query<FileAttachment[], { type: 'channel' | 'conversation'; id: string }>({
      query: ({ type, id }) => `/${type === 'channel' ? 'channels' : 'conversations'}/${id}/files`,
      providesTags: ['File'],
    }),

    // Search
    searchMessages: builder.query<Message[], { orgId: string; query: string }>({
      query: ({ orgId, query }) => ({
        url: `/organizations/${orgId}/search`,
        params: { q: query },
      }),
    }),
  }),
});

export const {
  useGetOrganizationsQuery,
  useGetTeamsQuery,
  useCreateTeamMutation,
  useGetChannelsQuery,
  useCreateChannelMutation,
  useGetConversationsQuery,
  useCreateConversationMutation,
  useGetMessagesQuery,
  useSendMessageMutation,
  useEditMessageMutation,
  useDeleteMessageMutation,
  useAddReactionMutation,
  useRemoveReactionMutation,
  useGetThreadMessagesQuery,
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
  useSearchMessagesQuery,
} = chatApi;
