import type { User } from './user';

export type ConversationType = 'direct' | 'group';
export type GroupRole = 'GroupAdmin' | 'GroupMember';

export interface Participant {
  userId: string;
  role: GroupRole;
  joinedAt: string;
  addedBy: string | null;
  user?: User;
}

export interface LastMessage {
  messageId: string | null;
  content: string | null;
  senderId: string | null;
  sentAt: string | null;
  type: string | null;
}

export interface Conversation {
  _id: string;
  type: ConversationType;
  organizationId: string;
  name: string | null;
  avatar: { url: string | null; publicId: string | null };
  createdBy: string | null;
  participants: Participant[];
  lastMessage: LastMessage;
  createdAt: string;
  updatedAt: string;
}

export type MessageType = 'text' | 'file' | 'image' | 'video' | 'system';

export interface Reaction {
  emoji: string;
  users: string[];
  count: number;
}

export interface Receipt {
  userId: string;
  status: 'delivered' | 'seen';
  timestamp: string;
}

export type DmStatus = 'sending' | 'sent' | 'delivered' | 'seen';

export interface FileAttachment {
  _id: string;
  uploadedBy: string;
  url: string;
  publicId: string;
  resourceType: 'image' | 'video' | 'raw';
  originalName: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  thumbnailUrl?: string;
}

export interface Message {
  _id: string;
  senderId: string;
  channelId?: string;
  conversationId?: string;
  type: MessageType;
  content: string;
  attachments: FileAttachment[];
  reactions: Reaction[];
  threadId: string | null;
  replyCount: number;
  lastReplyAt: string | null;
  mentions: string[];
  dmStatus: DmStatus | null;
  dmDeliveredAt: string | null;
  dmSeenAt: string | null;
  receipts: Receipt[];
  isEdited: boolean;
  editedAt: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
  sender?: User;
  createdAt: string;
  updatedAt: string;
}

export interface ReadState {
  _id: string;
  userId: string;
  channelId?: string;
  conversationId?: string;
  lastReadMessageId: string | null;
  lastReadAt: string | null;
  unreadCount: number;
  mentionCount: number;
}

export type NotificationType =
  | 'mention' | 'thread_reply' | 'reaction' | 'dm'
  | 'group_message' | 'added_to_team' | 'added_to_channel' | 'added_to_group';

export interface Notification {
  _id: string;
  recipientId: string;
  actorId: string | null;
  type: NotificationType;
  messageId?: string;
  channelId?: string;
  conversationId?: string;
  teamId?: string;
  preview: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  actor?: User;
}

export interface PinnedMessage {
  _id: string;
  messageId: string;
  pinnedBy: string;
  channelId?: string;
  conversationId?: string;
  contentSnapshot: string | null;
  pinnedAt: string;
  message?: Message;
  pinner?: User;
}

// ── View Models (used by domain layer) ─────────────────────────────────

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

/** Payload for sending a new message */
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
