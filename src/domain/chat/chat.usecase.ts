/**
 * Chat use cases — framework-agnostic where possible.
 *
 * For local/optimistic operations (mock data), these still accept dispatch
 * since there's no real API yet. When the real API is connected, these will
 * call chatApi instead and return data for the component to dispatch.
 *
 * Navigation use cases are kept here as thin orchestrators.
 */

import type { AppDispatch } from '@/app/store';
import type { ChatContext } from '@/types/ui';
import {
  addMessage, addThreadReply, toggleReaction,
  softDeleteMessage, editMessageAction, markContextAsRead,
} from '@/features/chatSlice';
import { setActiveChatContext, setActiveThread, setActiveNav } from '@/features/uiSlice';
import { createLocalMessage } from './chat.mapper';
import type { NavSection } from '@/types/ui';

/**
 * Send a message to a channel or conversation.
 * (Optimistic — works against local Redux state with mock data)
 */
export const sendMessage = (
  content: string,
  senderId: string,
  context: ChatContext | null,
  dispatch: AppDispatch,
  threadId?: string,
): boolean => {
  if (!content.trim() || !context || !senderId) return false;

  const message = createLocalMessage(content.trim(), senderId, context, threadId);

  if (threadId) {
    dispatch(addThreadReply({ threadId, message }));
  } else {
    dispatch(addMessage({ contextId: context.id, message }));
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
 * Soft-delete a message.
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
  if (!content.trim()) return false;
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
