// ============================================================================
// Types derived from MongoDB schemas
// ============================================================================

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: { url: string | null; publicId: string | null };
  organizationIds: string[];
  createdAt: string;
  updatedAt: string;
}

export type Presence = 'online' | 'offline' | 'away';
export type UserStatusType = 'active' | 'busy' | 'do_not_disturb' | 'be_right_back' | 'appear_away' | 'appear_offline';

export interface UserStatus {
  _id: string;
  userId: string;
  presence: Presence;
  status: UserStatusType;
  statusMessage: string | null;
  lastSeenAt: string | null;
  activeSocketId: string | null;
}

export interface Organization {
  _id: string;
  name: string;
  slug: string;
  logo: { url: string | null; publicId: string | null };
  owner: string;
  createdAt: string;
}

export type MembershipScope = 'org' | 'team' | 'channel';
export type MembershipRole =
  | 'OrgOwner' | 'OrgAdmin' | 'OrgMember' | 'OrgGuest'
  | 'TeamOwner' | 'TeamMember' | 'TeamGuest'
  | 'ChannelModerator' | 'ChannelMember';

export interface Membership {
  _id: string;
  userId: string;
  organizationId?: string;
  teamId?: string;
  channelId?: string;
  scope: MembershipScope;
  role: MembershipRole;
  invitedBy?: string;
  joinedAt: string;
}

export interface Team {
  _id: string;
  name: string;
  description: string | null;
  organizationId: string;
  createdBy: string;
  avatar: { url: string | null; publicId: string | null };
  isPrivate: boolean;
  isArchived: boolean;
  archivedAt: string | null;
  memberCount: number;
  createdAt: string;
}

export type ChannelType = 'text' | 'announcement';

export interface Channel {
  _id: string;
  name: string;
  description: string | null;
  teamId: string;
  organizationId: string;
  createdBy: string;
  type: ChannelType;
  isPrivate: boolean;
  isArchived: boolean;
  memberCount: number;
  lastActivityAt: string;
  createdAt: string;
}

export type ConversationType = 'direct' | 'group';
export type GroupRole = 'GroupAdmin' | 'GroupMember';

export interface Participant {
  userId: string;
  role: GroupRole;
  joinedAt: string;
  addedBy: string | null;
  user?: User; // populated
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
  sender?: User; // populated
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

// ============================================================================
// App-level types
// ============================================================================

export type NavSection = 'activity' | 'chat' | 'teams' | 'notifications';

export interface ChatContext {
  type: 'channel' | 'conversation';
  id: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
