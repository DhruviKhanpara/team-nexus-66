/**
 * Chat API — plain HTTP functions.
 *
 * No hooks, no Redux, no RTK Query.
 * Each function calls apiClient and returns typed data.
 */

import { apiClient } from './baseApi';
import type {
  Team, Channel, Conversation, Message, ReadState,
  Notification, PinnedMessage, UserStatus, Membership,
  Organization, FileAttachment,
} from '@/types';

export const chatApi = {
  // ── Organizations ──────────────────────────────────────────────────
  getOrganizations: () =>
    apiClient<Organization[]>('/organizations'),

  // ── Teams ──────────────────────────────────────────────────────────
  getTeams: (orgId: string) =>
    apiClient<Team[]>(`/organizations/${orgId}/teams`),

  createTeam: (orgId: string, data: Partial<Team>) =>
    apiClient<Team>(`/organizations/${orgId}/teams`, { method: 'POST', body: data }),

  // ── Channels ───────────────────────────────────────────────────────
  getChannels: (teamId: string) =>
    apiClient<Channel[]>(`/teams/${teamId}/channels`),

  createChannel: (teamId: string, data: Partial<Channel>) =>
    apiClient<Channel>(`/teams/${teamId}/channels`, { method: 'POST', body: data }),

  // ── Conversations ──────────────────────────────────────────────────
  getConversations: (orgId: string) =>
    apiClient<Conversation[]>(`/organizations/${orgId}/conversations`),

  createConversation: (data: Partial<Conversation>) =>
    apiClient<Conversation>('/conversations', { method: 'POST', body: data }),

  // ── Messages ───────────────────────────────────────────────────────
  getMessages: (type: 'channel' | 'conversation', id: string, before?: string) =>
    apiClient<Message[]>(
      `/${type === 'channel' ? 'channels' : 'conversations'}/${id}/messages${before ? `?before=${before}` : ''}`,
    ),

  sendMessage: (type: 'channel' | 'conversation', id: string, data: FormData | object) =>
    apiClient<Message>(
      `/${type === 'channel' ? 'channels' : 'conversations'}/${id}/messages`,
      { method: 'POST', body: data },
    ),

  editMessage: (messageId: string, content: string) =>
    apiClient<Message>(`/messages/${messageId}`, { method: 'PATCH', body: { content } }),

  deleteMessage: (messageId: string) =>
    apiClient<void>(`/messages/${messageId}`, { method: 'DELETE' }),

  addReaction: (messageId: string, emoji: string) =>
    apiClient<Message>(`/messages/${messageId}/reactions`, { method: 'POST', body: { emoji } }),

  removeReaction: (messageId: string, emoji: string) =>
    apiClient<Message>(`/messages/${messageId}/reactions`, { method: 'DELETE', body: { emoji } }),

  // ── Threads ────────────────────────────────────────────────────────
  getThreadMessages: (threadId: string) =>
    apiClient<Message[]>(`/messages/${threadId}/thread`),

  replyToThread: (threadId: string, data: FormData | object) =>
    apiClient<Message>(`/messages/${threadId}/thread`, { method: 'POST', body: data }),

  // ── Read State ─────────────────────────────────────────────────────
  getReadStates: () =>
    apiClient<ReadState[]>('/read-states'),

  markAsRead: (type: 'channel' | 'conversation', id: string) =>
    apiClient<ReadState>(`/read-states/${type}/${id}/read`, { method: 'POST' }),

  // ── Notifications ──────────────────────────────────────────────────
  getNotifications: () =>
    apiClient<Notification[]>('/notifications'),

  markNotificationRead: (id: string) =>
    apiClient<void>(`/notifications/${id}/read`, { method: 'POST' }),

  markAllNotificationsRead: () =>
    apiClient<void>('/notifications/read-all', { method: 'POST' }),

  // ── Pinned Messages ────────────────────────────────────────────────
  getPinnedMessages: (type: 'channel' | 'conversation', id: string) =>
    apiClient<PinnedMessage[]>(`/${type === 'channel' ? 'channels' : 'conversations'}/${id}/pinned`),

  pinMessage: (messageId: string) =>
    apiClient<PinnedMessage>(`/messages/${messageId}/pin`, { method: 'POST' }),

  unpinMessage: (pinId: string) =>
    apiClient<void>(`/pinned/${pinId}`, { method: 'DELETE' }),

  // ── User Status ────────────────────────────────────────────────────
  getUserStatuses: (userIds: string[]) =>
    apiClient<UserStatus[]>(`/user-statuses?userIds=${userIds.join(',')}`),

  updateMyStatus: (data: Partial<UserStatus>) =>
    apiClient<UserStatus>('/user-statuses/me', { method: 'PATCH', body: data }),

  // ── Members ────────────────────────────────────────────────────────
  getMembers: (scope: string, id: string) =>
    apiClient<Membership[]>(`/${scope}s/${id}/members`),

  // ── Files ──────────────────────────────────────────────────────────
  getFiles: (type: 'channel' | 'conversation', id: string) =>
    apiClient<FileAttachment[]>(`/${type === 'channel' ? 'channels' : 'conversations'}/${id}/files`),

  // ── Search ─────────────────────────────────────────────────────────
  searchMessages: (orgId: string, query: string) =>
    apiClient<Message[]>(`/organizations/${orgId}/search?q=${encodeURIComponent(query)}`),
};
