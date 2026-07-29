/**
 * ChatView — main chat area with header, messages, and input.
 *
 * Owns channel message hydration for the selected workspace context.
 */

import { useAppSelector } from '@/app/store';
import { usePersistMarkAsRead } from '@/domain/chat';
import { useHydrateMessages, useLoadMoreMessages } from '@/domain/message';
import { useActiveChatTarget } from '@/hooks/useActiveChatTarget';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useEffect } from 'react';

const ChatView = () => {
  const { activeChatContext } = useAppSelector(s => s.ui);
  const { markAsRead } = usePersistMarkAsRead();

  // Channel or conversation — one hydration path for both.
  const target = useActiveChatTarget();
  useHydrateMessages(target);
  const { loadMore, hasMore } = useLoadMoreMessages(target);

  useEffect(() => {
    if (activeChatContext) {
      markAsRead(activeChatContext.type, activeChatContext.id);
    }
  }, [activeChatContext, markAsRead]);

  if (!activeChatContext) return null;

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background">
      <ChatHeader />
      <MessageList hasMore={hasMore} onLoadMore={loadMore} />
      <MessageInput />
    </div>
  );
};

export default ChatView;
