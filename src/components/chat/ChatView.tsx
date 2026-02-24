import { useAppSelector, useAppDispatch } from '@/app/store';
import { markContextAsRead } from '@/features/chatSlice';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useEffect } from 'react';

const ChatView = () => {
  const { activeChatContext } = useAppSelector(s => s.ui);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (activeChatContext) {
      dispatch(markContextAsRead({ type: activeChatContext.type, id: activeChatContext.id }));
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
