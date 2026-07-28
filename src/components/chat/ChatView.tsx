/**
 * ChatView — main chat area with header, messages, and input.
 *
 * Owns channel message hydration for the selected workspace context.
 */

import { useAppSelector } from '@/app/store';
import { usePersistMarkAsRead } from '@/domain/chat';
import {
  useHydrateChannelMessages,
  useLoadMoreChannelMessages,
} from '@/domain/message';
import {
  selectSelectedChannelId,
  selectSelectedOrgId,
  selectSelectedTeamId,
} from '@/features/selectors';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useEffect } from 'react';

const ChatView = () => {
  const { activeChatContext } = useAppSelector(s => s.ui);
  const orgId = useAppSelector(selectSelectedOrgId);
  const teamId = useAppSelector(selectSelectedTeamId);
  const channelId = useAppSelector(selectSelectedChannelId);
  const { markAsRead } = usePersistMarkAsRead();

  // Organization → Team → Channel → messages.
  useHydrateChannelMessages(orgId, teamId, channelId);
  const { loadMore, hasMore } = useLoadMoreChannelMessages(orgId, teamId, channelId);

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
