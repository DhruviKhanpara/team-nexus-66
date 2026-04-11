/**
 * MessageList — renders messages grouped by date.
 *
 * Uses domain/chat/chat.logic for grouping and avatar logic.
 */

import { useRef, useEffect, useMemo } from 'react';
import { useAppSelector } from '@/app/store';
import MessageBubble from './MessageBubble';
import { shouldShowAvatar, groupMessagesByDate } from '@/domain/chat';

const MessageList = () => {
  const { activeChatContext } = useAppSelector(s => s.ui);
  const { messages } = useAppSelector(s => s.chat);
  const bottomRef = useRef<HTMLDivElement>(null);

  const contextId = activeChatContext?.id || '';
  const contextMessages = messages[contextId] || [];

  const grouped = useMemo(() => groupMessagesByDate(contextMessages), [contextMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [contextMessages.length, contextId]);

  if (contextMessages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground text-sm">No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4">
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
                key={msg._id}
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
