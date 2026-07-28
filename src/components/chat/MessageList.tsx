/**
 * MessageList — renders backend channel messages grouped by date.
 *
 * Data comes from the message slice via focused selectors.
 */

import { useRef, useEffect, useMemo } from 'react';
import { useAppSelector } from '@/app/store';
import MessageBubble from './MessageBubble';
import { shouldShowAvatar, groupMessagesByDate } from '@/domain/chat';
import {
  selectMessagesForCurrentChannel,
  selectMessagesInitialized,
  selectMessagesLoading,
  selectMessagesLoadingMore,
  selectSelectedChannelId,
} from '@/features/selectors';

interface MessageListProps {
  hasMore?: boolean;
  onLoadMore?: () => void;
}

const MessageList = ({ hasMore = false, onLoadMore }: MessageListProps) => {
  const channelId = useAppSelector(selectSelectedChannelId);
  const messages = useAppSelector(selectMessagesForCurrentChannel);
  const isLoading = useAppSelector(selectMessagesLoading);
  const isLoadingMore = useAppSelector(selectMessagesLoadingMore);
  const initialized = useAppSelector(selectMessagesInitialized);
  const bottomRef = useRef<HTMLDivElement>(null);

  const grouped = useMemo(() => groupMessagesByDate(messages), [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, channelId]);

  if (!channelId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Select a channel to start chatting.</p>
      </div>
    );
  }

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading messages…</p>
      </div>
    );
  }

  if (initialized && messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground text-sm">No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4">
      {hasMore && (
        <div className="flex justify-center pb-2">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="text-xs text-primary hover:underline disabled:opacity-50"
          >
            {isLoadingMore ? 'Loading…' : 'Load earlier messages'}
          </button>
        </div>
      )}

      {grouped.map(group => (
        <div key={group.date}>
          {/* Date separator */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs font-medium text-muted-foreground px-2">{group.date}</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {group.messages.map((msg, i) => {
            const prevMsg = i > 0 ? group.messages[i - 1] : null;
            const showAv = shouldShowAvatar(
              msg.senderId,
              msg.createdAt,
              prevMsg?.senderId,
              prevMsg?.createdAt,
            );

            return (
              <MessageBubble
                key={msg.id}
                message={msg}
                showAvatar={showAv}
              />
            );
          })}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
