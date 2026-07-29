/**
 * Chat target — the unified addressing model for messaging.
 *
 * Messages live either in a workspace channel or in a conversation
 * (direct / group). Every messaging surface (state buckets, use cases,
 * UI components) is keyed by the derived scope key so that a single
 * implementation serves both domains.
 */

export type ChatTargetKind = "channel" | "conversation";

export interface ChannelChatTarget {
  kind: "channel";
  orgId: string;
  teamId: string;
  channelId: string;
}

export interface ConversationChatTarget {
  kind: "conversation";
  conversationId: string;
}

export type ChatTarget = ChannelChatTarget | ConversationChatTarget;

export const channelScopeKey = (channelId: string): string =>
  `channel:${channelId}`;

export const conversationScopeKey = (conversationId: string): string =>
  `conversation:${conversationId}`;

/** Stable Redux bucket key for a chat target. */
export const toScopeKey = (target: ChatTarget | null): string | null => {
  if (!target) return null;
  return target.kind === "channel"
    ? channelScopeKey(target.channelId)
    : conversationScopeKey(target.conversationId);
};
