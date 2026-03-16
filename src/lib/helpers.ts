import type { User } from '@/types';

/** Extract initials from a user name (e.g., "John Doe" → "JD") */
export const getInitials = (name: string | undefined): string =>
  name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';

/** Determine whether a new avatar should be shown in a message group */
export const shouldShowAvatar = (
  currentSenderId: string,
  currentTime: string,
  prevSenderId?: string,
  prevTime?: string,
  thresholdMs = 5 * 60 * 1000,
): boolean => {
  if (!prevSenderId || !prevTime) return true;
  if (prevSenderId !== currentSenderId) return true;
  return new Date(currentTime).getTime() - new Date(prevTime).getTime() > thresholdMs;
};

/** Build a display name for a conversation */
export const getConversationDisplayName = (
  conv: { type: string; name: string | null; participants: { userId: string }[] },
  currentUserId: string | undefined,
  userMap: Record<string, User>,
): string => {
  if (conv.type === 'group') return conv.name || 'Group Chat';
  const other = conv.participants.find(p => p.userId !== currentUserId);
  return other ? userMap[other.userId]?.name || 'Unknown' : 'Unknown';
};

/** Human-readable text for notification activity */
export const getActivityLabel = (
  type: string,
  actorName: string | undefined,
): string => {
  const actor = actorName || 'Someone';
  const labels: Record<string, string> = {
    mention: `${actor} mentioned you`,
    thread_reply: `${actor} replied to a thread`,
    reaction: `${actor} reacted to your message`,
    dm: `${actor} sent you a message`,
    group_message: `${actor} sent a group message`,
    added_to_team: `${actor} added you to a team`,
    added_to_channel: `${actor} added you to a channel`,
    added_to_group: `${actor} added you to a group`,
  };
  return labels[type] || 'New activity';
};

/** Create a new message object for local dispatch */
export const createLocalMessage = (
  content: string,
  senderId: string,
  context: { type: 'channel' | 'conversation'; id: string } | null,
  threadId?: string,
) => ({
  _id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
  senderId,
  channelId: context?.type === 'channel' ? context.id : undefined,
  conversationId: context?.type === 'conversation' ? context.id : undefined,
  type: 'text' as const,
  content,
  attachments: [],
  reactions: [],
  threadId: threadId || null,
  replyCount: 0,
  lastReplyAt: null,
  mentions: [],
  dmStatus: context?.type === 'conversation' ? ('sent' as const) : null,
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
