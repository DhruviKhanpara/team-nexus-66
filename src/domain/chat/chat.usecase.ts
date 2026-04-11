/**
 * Chat domain — use cases.
 *
 * Orchestrates chat-related user flows:
 *  1. Validate input (via chat.logic)
 *  2. Create optimistic data (via chat.mapper)
 *  3. Dispatch state updates (via Redux)
 *
 * Currently operates against local Redux state with mock data.
 * When the real API is ready, these use cases will also call
 * the chatApi endpoints before/after dispatching.
 */

import type { AppDispatch } from '@/app/store';
import type { ChatContext } from '@/types/ui';
import { addMessage, addThreadReply, toggleReaction, softDeleteMessage, editMessageAction, markContextAsRead } from '@/features/chatSlice';
import { setActiveChatContext, setActiveThread, setActiveNav } from '@/features/uiSlice';
import { isValidMessageContent } from './chat.logic';
import { createLocalMessage } from './chat.mapper';
import type { NavSection } from '@/types/ui';

/**
 * Send a message to a channel or conversation.
 */
export const sendMessage = (
  content: string,
  senderId: string,
  context: ChatContext | null,
  dispatch: AppDispatch,
  threadId?: string,
): boolean => {
  if (!isValidMessageContent(content) || !context || !senderId) {
    return false;
  }

  const contextId = threadId || context.id;
  const message = createLocalMessage(content.trim(), senderId, context, threadId);

  if (threadId) {
    dispatch(addThreadReply({ threadId, message }));
  } else {
    dispatch(addMessage({ contextId, message }));
  }

  return true;
};

/**
 * Navigate to a specific chat context (channel or conversation).
 */
export const navigateToChat = (
  type: 'channel' | 'conversation',
  id: string,
  dispatch: AppDispatch,
) => {
  const navSection: NavSection = type === 'channel' ? 'teams' : 'chat';
  dispatch(setActiveChatContext({ type, id }));
  dispatch(setActiveNav(navSection));
};

/**
 * Open a message thread.
 */
export const openThread = (messageId: string, dispatch: AppDispatch) => {
  dispatch(setActiveThread(messageId));
};

/**
 * Close the active thread.
 */
export const closeThread = (dispatch: AppDispatch) => {
  dispatch(setActiveThread(null));
};

/**
 * Toggle an emoji reaction on a message.
 */
export const toggleMessageReaction = (
  contextId: string,
  messageId: string,
  emoji: string,
  userId: string,
  dispatch: AppDispatch,
) => {
  dispatch(toggleReaction({ contextId, messageId, emoji, userId }));
};

/**
 * Soft-delete a message (mark as deleted without removing).
 */
export const deleteMessage = (
  contextId: string,
  messageId: string,
  userId: string,
  dispatch: AppDispatch,
) => {
  dispatch(softDeleteMessage({ contextId, messageId, userId }));
};

/**
 * Edit a message's content.
 */
export const editMessage = (
  contextId: string,
  messageId: string,
  content: string,
  dispatch: AppDispatch,
) => {
  if (!isValidMessageContent(content)) return false;
  dispatch(editMessageAction({ contextId, messageId, content: content.trim() }));
  return true;
};

/**
 * Mark a channel or conversation as read.
 */
export const markAsRead = (
  type: 'channel' | 'conversation',
  id: string,
  dispatch: AppDispatch,
) => {
  dispatch(markContextAsRead({ type, id }));
};
