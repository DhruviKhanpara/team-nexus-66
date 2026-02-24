import { useRef, useEffect } from 'react';
import { useAppSelector } from '@/app/store';
import MessageBubble from './MessageBubble';

const MessageList = () => {
  const { activeChatContext } = useAppSelector(s => s.ui);
  const { messages } = useAppSelector(s => s.chat);
  const bottomRef = useRef<HTMLDivElement>(null);

  const contextId = activeChatContext?.id || '';
  const contextMessages = messages[contextId] || [];

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

  // Group messages by date
  const grouped: { date: string; msgs: typeof contextMessages }[] = [];
  contextMessages.forEach(msg => {
    const date = new Date(msg.createdAt).toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric',
    });
    const last = grouped[grouped.length - 1];
    if (last && last.date === date) {
      last.msgs.push(msg);
    } else {
      grouped.push({ date, msgs: [msg] });
    }
  });

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

          {group.msgs.map((msg, i) => {
            const prevMsg = i > 0 ? group.msgs[i - 1] : null;
            const showAvatar = !prevMsg ||
              prevMsg.senderId !== msg.senderId ||
              new Date(msg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime() > 5 * 60 * 1000;

            return (
              <MessageBubble
                key={msg._id}
                message={msg}
                showAvatar={showAvatar}
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
