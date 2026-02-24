import type {
  User, Organization, Team, Channel, Conversation,
  Message, UserStatus, ReadState, Notification,
} from '@/types';

// ============================================================================
// Users
// ============================================================================

export const currentUser: User = {
  _id: 'u1',
  name: 'John Doe',
  email: 'john@acmecorp.com',
  avatar: { url: null, publicId: null },
  organizationIds: ['org1'],
  createdAt: '2024-01-15T00:00:00Z',
  updatedAt: '2024-01-15T00:00:00Z',
};

export const users: User[] = [
  currentUser,
  { _id: 'u2', name: 'Sarah Chen', email: 'sarah@acmecorp.com', avatar: { url: null, publicId: null }, organizationIds: ['org1'], createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-01-15T00:00:00Z' },
  { _id: 'u3', name: 'Mike Rivera', email: 'mike@acmecorp.com', avatar: { url: null, publicId: null }, organizationIds: ['org1'], createdAt: '2024-02-01T00:00:00Z', updatedAt: '2024-02-01T00:00:00Z' },
  { _id: 'u4', name: 'Emily Park', email: 'emily@acmecorp.com', avatar: { url: null, publicId: null }, organizationIds: ['org1'], createdAt: '2024-02-10T00:00:00Z', updatedAt: '2024-02-10T00:00:00Z' },
  { _id: 'u5', name: 'Alex Thompson', email: 'alex@acmecorp.com', avatar: { url: null, publicId: null }, organizationIds: ['org1'], createdAt: '2024-03-01T00:00:00Z', updatedAt: '2024-03-01T00:00:00Z' },
  { _id: 'u6', name: 'Priya Sharma', email: 'priya@acmecorp.com', avatar: { url: null, publicId: null }, organizationIds: ['org1'], createdAt: '2024-03-05T00:00:00Z', updatedAt: '2024-03-05T00:00:00Z' },
];

export const userMap: Record<string, User> = Object.fromEntries(users.map(u => [u._id, u]));

// ============================================================================
// User Statuses
// ============================================================================

export const userStatuses: UserStatus[] = [
  { _id: 'us1', userId: 'u1', presence: 'online', status: 'active', statusMessage: null, lastSeenAt: null, activeSocketId: null },
  { _id: 'us2', userId: 'u2', presence: 'online', status: 'active', statusMessage: 'Working on the new feature', lastSeenAt: null, activeSocketId: null },
  { _id: 'us3', userId: 'u3', presence: 'away', status: 'be_right_back', statusMessage: 'Lunch break', lastSeenAt: '2024-06-15T12:00:00Z', activeSocketId: null },
  { _id: 'us4', userId: 'u4', presence: 'online', status: 'busy', statusMessage: 'In a meeting', lastSeenAt: null, activeSocketId: null },
  { _id: 'us5', userId: 'u5', presence: 'offline', status: 'active', statusMessage: null, lastSeenAt: '2024-06-15T10:00:00Z', activeSocketId: null },
  { _id: 'us6', userId: 'u6', presence: 'online', status: 'do_not_disturb', statusMessage: 'Deep focus time', lastSeenAt: null, activeSocketId: null },
];

export const statusMap: Record<string, UserStatus> = Object.fromEntries(userStatuses.map(s => [s.userId, s]));

// ============================================================================
// Organization
// ============================================================================

export const organization: Organization = {
  _id: 'org1',
  name: 'Acme Corp',
  slug: 'acme-corp',
  logo: { url: null, publicId: null },
  owner: 'u1',
  createdAt: '2024-01-01T00:00:00Z',
};

// ============================================================================
// Teams
// ============================================================================

export const teams: Team[] = [
  { _id: 't1', name: 'Engineering', description: 'Software engineering team', organizationId: 'org1', createdBy: 'u1', avatar: { url: null, publicId: null }, isPrivate: false, isArchived: false, archivedAt: null, memberCount: 6, createdAt: '2024-01-15T00:00:00Z' },
  { _id: 't2', name: 'Design', description: 'Product design and UX', organizationId: 'org1', createdBy: 'u2', avatar: { url: null, publicId: null }, isPrivate: false, isArchived: false, archivedAt: null, memberCount: 4, createdAt: '2024-01-20T00:00:00Z' },
  { _id: 't3', name: 'Marketing', description: 'Growth and marketing', organizationId: 'org1', createdBy: 'u4', avatar: { url: null, publicId: null }, isPrivate: false, isArchived: false, archivedAt: null, memberCount: 3, createdAt: '2024-02-01T00:00:00Z' },
];

// ============================================================================
// Channels
// ============================================================================

export const channels: Channel[] = [
  { _id: 'ch1', name: 'general', description: 'General engineering discussion', teamId: 't1', organizationId: 'org1', createdBy: 'u1', type: 'text', isPrivate: false, isArchived: false, memberCount: 6, lastActivityAt: '2024-06-15T14:30:00Z', createdAt: '2024-01-15T00:00:00Z' },
  { _id: 'ch2', name: 'frontend', description: 'Frontend development', teamId: 't1', organizationId: 'org1', createdBy: 'u1', type: 'text', isPrivate: false, isArchived: false, memberCount: 4, lastActivityAt: '2024-06-15T13:00:00Z', createdAt: '2024-01-15T00:00:00Z' },
  { _id: 'ch3', name: 'backend', description: 'Backend & infrastructure', teamId: 't1', organizationId: 'org1', createdBy: 'u1', type: 'text', isPrivate: false, isArchived: false, memberCount: 3, lastActivityAt: '2024-06-15T11:00:00Z', createdAt: '2024-01-15T00:00:00Z' },
  { _id: 'ch4', name: 'announcements', description: 'Important announcements only', teamId: 't1', organizationId: 'org1', createdBy: 'u1', type: 'announcement', isPrivate: false, isArchived: false, memberCount: 6, lastActivityAt: '2024-06-14T09:00:00Z', createdAt: '2024-01-15T00:00:00Z' },
  { _id: 'ch5', name: 'general', description: 'Design team general', teamId: 't2', organizationId: 'org1', createdBy: 'u2', type: 'text', isPrivate: false, isArchived: false, memberCount: 4, lastActivityAt: '2024-06-15T12:00:00Z', createdAt: '2024-01-20T00:00:00Z' },
  { _id: 'ch6', name: 'ui-reviews', description: 'UI/UX review discussions', teamId: 't2', organizationId: 'org1', createdBy: 'u2', type: 'text', isPrivate: false, isArchived: false, memberCount: 4, lastActivityAt: '2024-06-14T15:00:00Z', createdAt: '2024-01-25T00:00:00Z' },
  { _id: 'ch7', name: 'general', description: 'Marketing general', teamId: 't3', organizationId: 'org1', createdBy: 'u4', type: 'text', isPrivate: false, isArchived: false, memberCount: 3, lastActivityAt: '2024-06-15T10:00:00Z', createdAt: '2024-02-01T00:00:00Z' },
];

// ============================================================================
// Conversations (DMs + Group Chats)
// ============================================================================

export const conversations: Conversation[] = [
  {
    _id: 'conv1', type: 'direct', organizationId: 'org1', name: null,
    avatar: { url: null, publicId: null }, createdBy: null,
    participants: [
      { userId: 'u1', role: 'GroupMember', joinedAt: '2024-01-15T00:00:00Z', addedBy: null },
      { userId: 'u2', role: 'GroupMember', joinedAt: '2024-01-15T00:00:00Z', addedBy: null },
    ],
    lastMessage: { messageId: 'msg_dm1', content: 'Sure, let me check on that.', senderId: 'u2', sentAt: '2024-06-15T14:20:00Z', type: 'text' },
    createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-06-15T14:20:00Z',
  },
  {
    _id: 'conv2', type: 'direct', organizationId: 'org1', name: null,
    avatar: { url: null, publicId: null }, createdBy: null,
    participants: [
      { userId: 'u1', role: 'GroupMember', joinedAt: '2024-02-01T00:00:00Z', addedBy: null },
      { userId: 'u3', role: 'GroupMember', joinedAt: '2024-02-01T00:00:00Z', addedBy: null },
    ],
    lastMessage: { messageId: 'msg_dm2', content: 'The PR is ready for review 🚀', senderId: 'u3', sentAt: '2024-06-15T11:30:00Z', type: 'text' },
    createdAt: '2024-02-01T00:00:00Z', updatedAt: '2024-06-15T11:30:00Z',
  },
  {
    _id: 'conv3', type: 'group', organizationId: 'org1', name: 'Frontend Crew',
    avatar: { url: null, publicId: null }, createdBy: 'u1',
    participants: [
      { userId: 'u1', role: 'GroupAdmin', joinedAt: '2024-03-01T00:00:00Z', addedBy: null },
      { userId: 'u2', role: 'GroupMember', joinedAt: '2024-03-01T00:00:00Z', addedBy: 'u1' },
      { userId: 'u4', role: 'GroupMember', joinedAt: '2024-03-01T00:00:00Z', addedBy: 'u1' },
      { userId: 'u6', role: 'GroupMember', joinedAt: '2024-03-05T00:00:00Z', addedBy: 'u1' },
    ],
    lastMessage: { messageId: 'msg_grp1', content: 'Let\'s sync on the design tokens tomorrow', senderId: 'u4', sentAt: '2024-06-15T13:45:00Z', type: 'text' },
    createdAt: '2024-03-01T00:00:00Z', updatedAt: '2024-06-15T13:45:00Z',
  },
];

// ============================================================================
// Messages — Engineering > general channel
// ============================================================================

export const channelMessages: Record<string, Message[]> = {
  ch1: [
    { _id: 'msg1', senderId: 'u2', channelId: 'ch1', type: 'text', content: 'Hey team! Just pushed the new auth module to staging. Can someone run a quick smoke test?', attachments: [], reactions: [{ emoji: '👍', users: ['u1', 'u3'], count: 2 }, { emoji: '🚀', users: ['u4'], count: 1 }], threadId: null, replyCount: 2, lastReplyAt: '2024-06-15T14:10:00Z', mentions: [], dmStatus: null, dmDeliveredAt: null, dmSeenAt: null, receipts: [], isEdited: false, editedAt: null, deletedAt: null, deletedBy: null, createdAt: '2024-06-15T14:00:00Z', updatedAt: '2024-06-15T14:00:00Z' },
    { _id: 'msg2', senderId: 'u1', channelId: 'ch1', type: 'text', content: 'On it! I\'ll check the login flow and report back.', attachments: [], reactions: [], threadId: null, replyCount: 0, lastReplyAt: null, mentions: [], dmStatus: null, dmDeliveredAt: null, dmSeenAt: null, receipts: [], isEdited: false, editedAt: null, deletedAt: null, deletedBy: null, createdAt: '2024-06-15T14:05:00Z', updatedAt: '2024-06-15T14:05:00Z' },
    { _id: 'msg3', senderId: 'u3', channelId: 'ch1', type: 'text', content: 'Also, I noticed we have some flaky tests in the CI pipeline. Mainly the websocket integration tests. I\'ll take a look at those today.', attachments: [], reactions: [{ emoji: '🙏', users: ['u2'], count: 1 }], threadId: null, replyCount: 0, lastReplyAt: null, mentions: [], dmStatus: null, dmDeliveredAt: null, dmSeenAt: null, receipts: [], isEdited: false, editedAt: null, deletedAt: null, deletedBy: null, createdAt: '2024-06-15T14:10:00Z', updatedAt: '2024-06-15T14:10:00Z' },
    { _id: 'msg4', senderId: 'u6', channelId: 'ch1', type: 'text', content: '@Sarah the auth module looks great! One thing — the token refresh logic might need a retry mechanism for poor network conditions.', attachments: [], reactions: [], threadId: null, replyCount: 3, lastReplyAt: '2024-06-15T14:25:00Z', mentions: ['u2'], dmStatus: null, dmDeliveredAt: null, dmSeenAt: null, receipts: [], isEdited: false, editedAt: null, deletedAt: null, deletedBy: null, createdAt: '2024-06-15T14:15:00Z', updatedAt: '2024-06-15T14:15:00Z' },
    { _id: 'msg5', senderId: 'u4', channelId: 'ch1', type: 'text', content: 'Quick reminder: sprint retro is tomorrow at 2pm. Please add your notes to the doc beforehand.', attachments: [], reactions: [{ emoji: '✅', users: ['u1', 'u2', 'u3', 'u6'], count: 4 }], threadId: null, replyCount: 0, lastReplyAt: null, mentions: [], dmStatus: null, dmDeliveredAt: null, dmSeenAt: null, receipts: [], isEdited: false, editedAt: null, deletedAt: null, deletedBy: null, createdAt: '2024-06-15T14:30:00Z', updatedAt: '2024-06-15T14:30:00Z' },
  ],
  ch2: [
    { _id: 'msg_fe1', senderId: 'u1', channelId: 'ch2', type: 'text', content: 'Started working on the new sidebar component. Using the compound component pattern for flexibility.', attachments: [], reactions: [{ emoji: '💪', users: ['u2', 'u4'], count: 2 }], threadId: null, replyCount: 0, lastReplyAt: null, mentions: [], dmStatus: null, dmDeliveredAt: null, dmSeenAt: null, receipts: [], isEdited: false, editedAt: null, deletedAt: null, deletedBy: null, createdAt: '2024-06-15T12:00:00Z', updatedAt: '2024-06-15T12:00:00Z' },
    { _id: 'msg_fe2', senderId: 'u4', channelId: 'ch2', type: 'text', content: 'Nice! Can you share the design tokens you\'re using? I want to make sure we\'re consistent with the new design system.', attachments: [], reactions: [], threadId: null, replyCount: 0, lastReplyAt: null, mentions: [], dmStatus: null, dmDeliveredAt: null, dmSeenAt: null, receipts: [], isEdited: false, editedAt: null, deletedAt: null, deletedBy: null, createdAt: '2024-06-15T12:30:00Z', updatedAt: '2024-06-15T12:30:00Z' },
    { _id: 'msg_fe3', senderId: 'u1', channelId: 'ch2', type: 'text', content: 'Sure! I\'ll push the tokens file after lunch. We\'re going with HSL for all color values now.', attachments: [], reactions: [{ emoji: '👍', users: ['u4'], count: 1 }], threadId: null, replyCount: 0, lastReplyAt: null, mentions: [], dmStatus: null, dmDeliveredAt: null, dmSeenAt: null, receipts: [], isEdited: false, editedAt: null, deletedAt: null, deletedBy: null, createdAt: '2024-06-15T13:00:00Z', updatedAt: '2024-06-15T13:00:00Z' },
  ],
};

// ============================================================================
// DM Messages
// ============================================================================

export const conversationMessages: Record<string, Message[]> = {
  conv1: [
    { _id: 'msg_dm1_1', senderId: 'u1', conversationId: 'conv1', type: 'text', content: 'Hey Sarah, do you have time to review the API changes today?', attachments: [], reactions: [], threadId: null, replyCount: 0, lastReplyAt: null, mentions: [], dmStatus: 'seen', dmDeliveredAt: '2024-06-15T14:01:00Z', dmSeenAt: '2024-06-15T14:02:00Z', receipts: [], isEdited: false, editedAt: null, deletedAt: null, deletedBy: null, createdAt: '2024-06-15T14:00:00Z', updatedAt: '2024-06-15T14:00:00Z' },
    { _id: 'msg_dm1_2', senderId: 'u2', conversationId: 'conv1', type: 'text', content: 'Sure, let me check on that. I should be free after standup.', attachments: [], reactions: [], threadId: null, replyCount: 0, lastReplyAt: null, mentions: [], dmStatus: 'seen', dmDeliveredAt: '2024-06-15T14:11:00Z', dmSeenAt: '2024-06-15T14:12:00Z', receipts: [], isEdited: false, editedAt: null, deletedAt: null, deletedBy: null, createdAt: '2024-06-15T14:10:00Z', updatedAt: '2024-06-15T14:10:00Z' },
    { _id: 'msg_dm1_3', senderId: 'u1', conversationId: 'conv1', type: 'text', content: 'Perfect, thanks! The PR link is in the #frontend channel.', attachments: [], reactions: [{ emoji: '👍', users: ['u2'], count: 1 }], threadId: null, replyCount: 0, lastReplyAt: null, mentions: [], dmStatus: 'seen', dmDeliveredAt: '2024-06-15T14:16:00Z', dmSeenAt: '2024-06-15T14:17:00Z', receipts: [], isEdited: false, editedAt: null, deletedAt: null, deletedBy: null, createdAt: '2024-06-15T14:15:00Z', updatedAt: '2024-06-15T14:15:00Z' },
    { _id: 'msg_dm1', senderId: 'u2', conversationId: 'conv1', type: 'text', content: 'Sure, let me check on that.', attachments: [], reactions: [], threadId: null, replyCount: 0, lastReplyAt: null, mentions: [], dmStatus: 'delivered', dmDeliveredAt: '2024-06-15T14:21:00Z', dmSeenAt: null, receipts: [], isEdited: false, editedAt: null, deletedAt: null, deletedBy: null, createdAt: '2024-06-15T14:20:00Z', updatedAt: '2024-06-15T14:20:00Z' },
  ],
  conv2: [
    { _id: 'msg_dm2_1', senderId: 'u3', conversationId: 'conv2', type: 'text', content: 'The PR is ready for review 🚀', attachments: [], reactions: [], threadId: null, replyCount: 0, lastReplyAt: null, mentions: [], dmStatus: 'delivered', dmDeliveredAt: '2024-06-15T11:31:00Z', dmSeenAt: null, receipts: [], isEdited: false, editedAt: null, deletedAt: null, deletedBy: null, createdAt: '2024-06-15T11:30:00Z', updatedAt: '2024-06-15T11:30:00Z' },
  ],
  conv3: [
    { _id: 'msg_grp1_1', senderId: 'u1', conversationId: 'conv3', type: 'text', content: 'Hey everyone! Let\'s use this group to coordinate our frontend work.', attachments: [], reactions: [{ emoji: '🎉', users: ['u2', 'u4', 'u6'], count: 3 }], threadId: null, replyCount: 0, lastReplyAt: null, mentions: [], dmStatus: null, dmDeliveredAt: null, dmSeenAt: null, receipts: [], isEdited: false, editedAt: null, deletedAt: null, deletedBy: null, createdAt: '2024-06-15T10:00:00Z', updatedAt: '2024-06-15T10:00:00Z' },
    { _id: 'msg_grp1', senderId: 'u4', conversationId: 'conv3', type: 'text', content: 'Let\'s sync on the design tokens tomorrow', attachments: [], reactions: [], threadId: null, replyCount: 0, lastReplyAt: null, mentions: [], dmStatus: null, dmDeliveredAt: null, dmSeenAt: null, receipts: [], isEdited: false, editedAt: null, deletedAt: null, deletedBy: null, createdAt: '2024-06-15T13:45:00Z', updatedAt: '2024-06-15T13:45:00Z' },
  ],
};

// ============================================================================
// Read States
// ============================================================================

export const readStates: ReadState[] = [
  { _id: 'rs1', userId: 'u1', channelId: 'ch1', unreadCount: 0, mentionCount: 0, lastReadMessageId: 'msg5', lastReadAt: '2024-06-15T14:30:00Z' },
  { _id: 'rs2', userId: 'u1', channelId: 'ch2', unreadCount: 2, mentionCount: 0, lastReadMessageId: 'msg_fe1', lastReadAt: '2024-06-15T12:00:00Z' },
  { _id: 'rs3', userId: 'u1', channelId: 'ch3', unreadCount: 0, mentionCount: 0, lastReadMessageId: null, lastReadAt: null },
  { _id: 'rs4', userId: 'u1', conversationId: 'conv1', unreadCount: 1, mentionCount: 0, lastReadMessageId: 'msg_dm1_3', lastReadAt: '2024-06-15T14:15:00Z' },
  { _id: 'rs5', userId: 'u1', conversationId: 'conv2', unreadCount: 1, mentionCount: 0, lastReadMessageId: null, lastReadAt: null },
  { _id: 'rs6', userId: 'u1', conversationId: 'conv3', unreadCount: 0, mentionCount: 0, lastReadMessageId: 'msg_grp1', lastReadAt: '2024-06-15T13:45:00Z' },
];

// ============================================================================
// Notifications
// ============================================================================

export const notifications: Notification[] = [
  { _id: 'n1', recipientId: 'u1', actorId: 'u6', type: 'mention', messageId: 'msg4', channelId: 'ch1', preview: '@Sarah the auth module looks great!...', isRead: false, readAt: null, createdAt: '2024-06-15T14:15:00Z' },
  { _id: 'n2', recipientId: 'u1', actorId: 'u3', type: 'dm', conversationId: 'conv2', preview: 'The PR is ready for review 🚀', isRead: false, readAt: null, createdAt: '2024-06-15T11:30:00Z' },
  { _id: 'n3', recipientId: 'u1', actorId: 'u2', type: 'thread_reply', messageId: 'msg1', channelId: 'ch1', preview: 'Tests all passing now!', isRead: true, readAt: '2024-06-15T14:20:00Z', createdAt: '2024-06-15T14:10:00Z' },
  { _id: 'n4', recipientId: 'u1', actorId: 'u4', type: 'reaction', messageId: 'msg_fe1', channelId: 'ch2', preview: 'reacted 💪 to your message', isRead: true, readAt: '2024-06-15T13:00:00Z', createdAt: '2024-06-15T12:30:00Z' },
];

// ============================================================================
// Thread Messages (replies to msg1 in ch1)
// ============================================================================

export const threadMessages: Record<string, Message[]> = {
  msg1: [
    { _id: 'msg1_t1', senderId: 'u1', channelId: 'ch1', type: 'text', content: 'Smoke test passed! Login, registration, and password reset all working fine.', attachments: [], reactions: [{ emoji: '✅', users: ['u2'], count: 1 }], threadId: 'msg1', replyCount: 0, lastReplyAt: null, mentions: [], dmStatus: null, dmDeliveredAt: null, dmSeenAt: null, receipts: [], isEdited: false, editedAt: null, deletedAt: null, deletedBy: null, createdAt: '2024-06-15T14:08:00Z', updatedAt: '2024-06-15T14:08:00Z' },
    { _id: 'msg1_t2', senderId: 'u2', channelId: 'ch1', type: 'text', content: 'Awesome, thanks for checking! I\'ll merge to main now.', attachments: [], reactions: [], threadId: 'msg1', replyCount: 0, lastReplyAt: null, mentions: [], dmStatus: null, dmDeliveredAt: null, dmSeenAt: null, receipts: [], isEdited: false, editedAt: null, deletedAt: null, deletedBy: null, createdAt: '2024-06-15T14:10:00Z', updatedAt: '2024-06-15T14:10:00Z' },
  ],
  msg4: [
    { _id: 'msg4_t1', senderId: 'u2', channelId: 'ch1', type: 'text', content: 'Good catch! I\'ll add exponential backoff to the refresh logic.', attachments: [], reactions: [], threadId: 'msg4', replyCount: 0, lastReplyAt: null, mentions: [], dmStatus: null, dmDeliveredAt: null, dmSeenAt: null, receipts: [], isEdited: false, editedAt: null, deletedAt: null, deletedBy: null, createdAt: '2024-06-15T14:18:00Z', updatedAt: '2024-06-15T14:18:00Z' },
    { _id: 'msg4_t2', senderId: 'u6', channelId: 'ch1', type: 'text', content: 'Also consider a max retry count — maybe 3 attempts before showing an error toast to the user.', attachments: [], reactions: [{ emoji: '💡', users: ['u2'], count: 1 }], threadId: 'msg4', replyCount: 0, lastReplyAt: null, mentions: [], dmStatus: null, dmDeliveredAt: null, dmSeenAt: null, receipts: [], isEdited: false, editedAt: null, deletedAt: null, deletedBy: null, createdAt: '2024-06-15T14:22:00Z', updatedAt: '2024-06-15T14:22:00Z' },
    { _id: 'msg4_t3', senderId: 'u2', channelId: 'ch1', type: 'text', content: 'Perfect, will do. I\'ll also add a "reconnecting..." state to the UI.', attachments: [], reactions: [], threadId: 'msg4', replyCount: 0, lastReplyAt: null, mentions: [], dmStatus: null, dmDeliveredAt: null, dmSeenAt: null, receipts: [], isEdited: false, editedAt: null, deletedAt: null, deletedBy: null, createdAt: '2024-06-15T14:25:00Z', updatedAt: '2024-06-15T14:25:00Z' },
  ],
};
