/**
 * Chat use case hooks — service layer.
 *
 * useHydrateX → fetch + store data
 * usePersistX → create/update/delete operations
 *
 * For local/optimistic operations (mock data phase), some hooks
 * dispatch directly. When APIs are connected, they'll use RTK Query.
 */

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  addMessage, addThreadReply, toggleReaction,
  softDeleteMessage, editMessageAction, markContextAsRead,
} from '@/features/chatSlice';
import { setActiveChatContext, setActiveThread, setActiveNav } from '@/features/uiSlice';
import { createLocalMessage } from './chat.mapper';
import type { NavSection } from '@/types/ui';

/**
 * Send a message (optimistic — works against local Redux state with mock data).
 */
export const usePersistMessage = () => {
  const dispatch = useAppDispatch();
  const activeChatContext = useAppSelector(s => s.ui.activeChatContext);
  const currentUser = useAppSelector(s => s.auth.user);

  const sendMessage = useCallback((content: string, threadId?: string) => {
    if (!content.trim() || !activeChatContext || !currentUser) return false;

    const message = createLocalMessage(content.trim(), currentUser.id, activeChatContext, threadId);

    if (threadId) {
      dispatch(addThreadReply({ threadId, message }));
    } else {
      dispatch(addMessage({ contextId: activeChatContext.id, message }));
    }

    return true;
  }, [dispatch, activeChatContext, currentUser]);

  return { sendMessage };
};

/**
 * Navigate to a specific chat context.
 */
export const useNavigateChat = () => {
  const dispatch = useAppDispatch();

  const navigateToChat = useCallback((type: 'channel' | 'conversation', id: string) => {
    const navSection: NavSection = type === 'channel' ? 'teams' : 'chat';
    dispatch(setActiveChatContext({ type, id }));
    dispatch(setActiveNav(navSection));
  }, [dispatch]);

  return { navigateToChat };
};

/**
 * Thread management.
 */
export const useThread = () => {
  const dispatch = useAppDispatch();

  const openThread = useCallback((messageId: string) => {
    dispatch(setActiveThread(messageId));
  }, [dispatch]);

  const closeThread = useCallback(() => {
    dispatch(setActiveThread(null));
  }, [dispatch]);

  return { openThread, closeThread };
};

/**
 * Toggle an emoji reaction on a message.
 */
export const usePersistReaction = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(s => s.auth.user);

  const toggleMessageReaction = useCallback((contextId: string, messageId: string, emoji: string) => {
    if (!currentUser) return;
    dispatch(toggleReaction({ contextId, messageId, emoji, userId: currentUser.id }));
  }, [dispatch, currentUser]);

  return { toggleMessageReaction };
};

/**
 * Delete a message.
 */
export const usePersistDeleteMessage = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(s => s.auth.user);

  const deleteMessage = useCallback((contextId: string, messageId: string) => {
    if (!currentUser) return;
    dispatch(softDeleteMessage({ contextId, messageId, userId: currentUser.id }));
  }, [dispatch, currentUser]);

  return { deleteMessage };
};

/**
 * Edit a message.
 */
export const usePersistEditMessage = () => {
  const dispatch = useAppDispatch();

  const editMessage = useCallback((contextId: string, messageId: string, content: string) => {
    if (!content.trim()) return false;
    dispatch(editMessageAction({ contextId, messageId, content: content.trim() }));
    return true;
  }, [dispatch]);

  return { editMessage };
};

/**
 * Mark a channel or conversation as read.
 */
export const usePersistMarkAsRead = () => {
  const dispatch = useAppDispatch();

  const markAsRead = useCallback((type: 'channel' | 'conversation', id: string) => {
    dispatch(markContextAsRead({ type, id }));
  }, [dispatch]);

  return { markAsRead };
};
