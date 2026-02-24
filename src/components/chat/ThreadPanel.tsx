import { useAppSelector, useAppDispatch } from '@/app/store';
import { setActiveThread } from '@/features/uiSlice';
import { addThreadReply } from '@/features/chatSlice';
import { userMap, currentUser } from '@/data/mockData';
import { X } from 'lucide-react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

const ThreadPanel = () => {
  const { activeThreadId, activeChatContext } = useAppSelector(s => s.ui);
  const { messages, threadMessages: threadMsgs } = useAppSelector(s => s.chat);
  const dispatch = useAppDispatch();

  if (!activeThreadId || !activeChatContext) return null;

  // Find parent message
  const contextMessages = messages[activeChatContext.id] || [];
  const parentMessage = contextMessages.find(m => m._id === activeThreadId);
  const replies = threadMsgs[activeThreadId] || [];

  if (!parentMessage) return null;

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="h-14 min-h-[56px] border-b border-border flex items-center justify-between px-4">
        <h3 className="text-sm font-semibold text-card-foreground">Thread</h3>
        <button
          onClick={() => dispatch(setActiveThread(null))}
          className="p-1.5 rounded hover:bg-accent transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Parent message */}
      <div className="px-2 pt-4 pb-2 border-b border-border">
        <MessageBubble message={parentMessage} showAvatar isThread />
      </div>

      {/* Replies */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {replies.length > 0 && (
          <div className="flex items-center gap-2 px-2 py-1 mb-2">
            <span className="text-xs text-muted-foreground">
              {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>
        )}
        {replies.map((msg, i) => {
          const prevMsg = i > 0 ? replies[i - 1] : null;
          const showAvatar = !prevMsg || prevMsg.senderId !== msg.senderId;
          return <MessageBubble key={msg._id} message={msg} showAvatar={showAvatar} isThread />;
        })}
      </div>

      {/* Reply input */}
      <MessageInput threadId={activeThreadId} />
    </div>
  );
};

export default ThreadPanel;
