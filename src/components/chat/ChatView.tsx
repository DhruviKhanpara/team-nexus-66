/**
 * ChatView — main chat area with header, messages, and input.
 *
 * Uses usePersistMarkAsRead use case hook.
 */

import { useAppSelector } from '@/app/store';
import { usePersistMarkAsRead } from '@/domain/chat';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useEffect } from 'react';

const ChatView = () => {
  const { activeChatContext } = useAppSelector(s => s.ui);
  const { markAsRead } = usePersistMarkAsRead();

  useEffect(() => {
    if (activeChatContext) {
      markAsRead(activeChatContext.type, activeChatContext.id);
    }
  }, [activeChatContext, markAsRead]);

  if (!activeChatContext) return null;

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background">
      <ChatHeader />
      <MessageList />
      <MessageInput />
    </div>
  );
};

export default ChatView;
