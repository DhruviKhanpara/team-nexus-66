/**
 * Chat domain types.
 *
 * View models and helper types for the chat feature.
 * DTOs reuse the existing types from @/types/chat.ts since
 * the frontend types already match the backend models closely.
 */

import type { Message, Notification } from '@/types/chat';
import type { User } from '@/types/user';

/** View model for a message with resolved sender info */
export interface MessageViewModel extends Message {
  senderName: string;
  senderInitials: string;
  isOwn: boolean;
  formattedTime: string;
  isDeleted: boolean;
}

/** View model for a notification with resolved actor info */
export interface NotificationViewModel extends Notification {
  actorName: string;
  actorInitials: string;
  timeAgo: string;
  icon: string;
}

/** Payload for sending a new message (pre-API) */
export interface SendMessageInput {
  content: string;
  contextType: 'channel' | 'conversation';
  contextId: string;
  threadId?: string;
}

/** Group of messages under a date heading */
export interface DateGroup {
  date: string;
  messages: Message[];
}
