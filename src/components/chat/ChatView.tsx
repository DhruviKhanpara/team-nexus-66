/**
 * ChatView — main chat area with header, messages, and input.
 *
 * Uses the markAsRead use case from the chat domain.
 */

import { useAppSelector, useAppDispatch } from '@/app/store';
import { markAsRead } from '@/domain/chat';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useEffect } from 'react';

const ChatView = () => {
  const { activeChatContext } = useAppSelector(s => s.ui);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (activeChatContext) {
      markAsRead(activeChatContext.type, activeChatContext.id, dispatch);
    }
  }, [activeChatContext, dispatch]);

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
