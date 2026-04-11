/**
 * Chat domain — pure business logic.
 *
 * Rules:
 *  - No API calls
 *  - No Redux
 *  - No side effects
 *  - Only pure functions
 */

import type { Message, Reaction } from '@/types/chat';
import type { DateGroup } from './chat.types';

// ── Message Validation ─────────────────────────────────────────────────

/** Check if message content is valid for sending */
export const isValidMessageContent = (content: string): boolean =>
  content.trim().length > 0;

/** Maximum allowed message length */
export const MAX_MESSAGE_LENGTH = 4000;

/** Check if content exceeds maximum length */
export const isMessageTooLong = (content: string): boolean =>
  content.length > MAX_MESSAGE_LENGTH;

// ── Message Grouping ───────────────────────────────────────────────────

const MESSAGE_GROUP_THRESHOLD_MS = 5 * 60 * 1000;

/**
 * Determine whether a new avatar/header should be shown for a message.
 *
 * A new group starts when:
 *  - It's the first message
 *  - The sender changed
 *  - More than 5 minutes passed since the previous message
 */
export const shouldShowAvatar = (
  currentSenderId: string,
  currentTime: string,
  prevSenderId?: string,
  prevTime?: string,
): boolean => {
  if (!prevSenderId || !prevTime) return true;
  if (prevSenderId !== currentSenderId) return true;
  return (
    new Date(currentTime).getTime() - new Date(prevTime).getTime() >
    MESSAGE_GROUP_THRESHOLD_MS
  );
};

/**
 * Group a flat list of messages by date for display.
 */
export const groupMessagesByDate = (messages: Message[]): DateGroup[] => {
  const grouped: DateGroup[] = [];

  messages.forEach((msg) => {
    const date = new Date(msg.createdAt).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
    const last = grouped[grouped.length - 1];
    if (last && last.date === date) {
      last.messages.push(msg);
    } else {
      grouped.push({ date, messages: [msg] });
    }
  });

  return grouped;
};

// ── Reactions ──────────────────────────────────────────────────────────

/**
 * Compute the next reactions array after toggling an emoji for a user.
 *
 * Returns a new array (immutable operation used by the slice).
 */
export const computeToggledReactions = (
  reactions: Reaction[],
  emoji: string,
  userId: string,
): Reaction[] => {
  const result = reactions.map((r) => ({ ...r, users: [...r.users] }));
  const existing = result.find((r) => r.emoji === emoji);

  if (existing) {
    if (existing.users.includes(userId)) {
      existing.users = existing.users.filter((u) => u !== userId);
      existing.count -= 1;
      if (existing.count === 0) {
        return result.filter((r) => r.emoji !== emoji);
      }
    } else {
      existing.users.push(userId);
      existing.count += 1;
    }
    return result;
  }

  return [...result, { emoji, users: [userId], count: 1 }];
};

// ── Display Helpers ────────────────────────────────────────────────────

/**
 * Build a display name for a conversation.
 * For direct messages, returns the other participant's name.
 * For group chats, returns the group name.
 */
export const getConversationDisplayName = (
  conv: { type: string; name: string | null; participants: { userId: string }[] },
  currentUserId: string | undefined,
  userMap: Record<string, { name: string }>,
): string => {
  if (conv.type === 'group') return conv.name || 'Group Chat';
  const other = conv.participants.find((p) => p.userId !== currentUserId);
  return other ? userMap[other.userId]?.name || 'Unknown' : 'Unknown';
};

/**
 * Human-readable label for a notification type.
 */
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
