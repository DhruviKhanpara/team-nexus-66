/**
 * Chat domain — DTO ↔ View Model mappers.
 *
 * Transforms raw message/notification data into UI-ready view models.
 *
 * Rules:
 *  - No API calls
 *  - No Redux
 *  - Pure transformation functions
 */

import { format } from 'date-fns';
import type { Message, MessageViewModel } from '@/types/chat';
import type { User } from '@/types/user';

/** Extract initials from a name */
const getInitials = (name: string | undefined): string =>
  name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || '?';

/**
 * Map a raw Message + context into a MessageViewModel.
 */
export const mapMessageToViewModel = (
  message: Message,
  sender: User | undefined,
  currentUserId: string | undefined,
): MessageViewModel => ({
  ...message,
  senderName: sender?.name || 'Unknown',
  senderInitials: getInitials(sender?.name),
  isOwn: message.senderId === currentUserId,
  formattedTime: format(new Date(message.createdAt), 'h:mm a'),
  isDeleted: message.deletedAt !== null,
});

/**
 * Create a local optimistic message object before the API responds.
 *
 * Used for instant UI feedback when sending a message.
 */
export const createLocalMessage = (
  content: string,
  senderId: string,
  context: { type: 'channel' | 'conversation'; id: string } | null,
  threadId?: string,
): Message => ({
  _id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
  senderId,
  channelId: context?.type === 'channel' ? context.id : undefined,
  conversationId: context?.type === 'conversation' ? context.id : undefined,
  type: 'text',
  content,
  attachments: [],
  reactions: [],
  threadId: threadId || null,
  replyCount: 0,
  lastReplyAt: null,
  mentions: [],
  dmStatus: context?.type === 'conversation' ? 'sent' : null,
  dmDeliveredAt: null,
  dmSeenAt: null,
  receipts: [],
  isEdited: false,
  editedAt: null,
  deletedAt: null,
  deletedBy: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
