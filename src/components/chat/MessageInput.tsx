import { useState, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/store';
import { addMessage } from '@/features/chatSlice';
import { currentUser } from '@/data/mockData';
import { Send, Paperclip, SmilePlus, AtSign, Bold, Italic, Code } from 'lucide-react';
import type { Message } from '@/types';

interface Props {
  threadId?: string;
  onSend?: () => void;
}

const MessageInput = ({ threadId, onSend }: Props) => {
  const { activeChatContext } = useAppSelector(s => s.ui);
  const dispatch = useAppDispatch();
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const contextId = threadId || activeChatContext?.id || '';

  const handleSend = () => {
    if (!content.trim() || !contextId) return;

    const newMessage: Message = {
      _id: `msg_${Date.now()}`,
      senderId: currentUser._id,
      channelId: activeChatContext?.type === 'channel' ? activeChatContext.id : undefined,
      conversationId: activeChatContext?.type === 'conversation' ? activeChatContext.id : undefined,
      type: 'text',
      content: content.trim(),
      attachments: [],
      reactions: [],
      threadId: threadId || null,
      replyCount: 0,
      lastReplyAt: null,
      mentions: [],
      dmStatus: activeChatContext?.type === 'conversation' ? 'sent' : null,
      dmDeliveredAt: null,
      dmSeenAt: null,
      receipts: [],
      isEdited: false,
      editedAt: null,
      deletedAt: null,
      deletedBy: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch(addMessage({ contextId, message: newMessage }));
    setContent('');
    onSend?.();

    // Auto-resize
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    // Auto-resize
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  };

  return (
    <div className="px-4 md:px-6 pb-4 pt-2">
      <div className="border border-border rounded-lg bg-card overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/50 transition-all">
        {/* Formatting toolbar */}
        <div className="flex items-center gap-0.5 px-3 py-1.5 border-b border-border">
          <button className="p-1.5 rounded hover:bg-accent transition-colors">
            <Bold className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="p-1.5 rounded hover:bg-accent transition-colors">
            <Italic className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="p-1.5 rounded hover:bg-accent transition-colors">
            <Code className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="w-px h-4 bg-border mx-1" />
          <button className="p-1.5 rounded hover:bg-accent transition-colors">
            <AtSign className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="p-1.5 rounded hover:bg-accent transition-colors">
            <SmilePlus className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Text area */}
        <div className="flex items-end gap-2 px-3 py-2">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none min-h-[24px] max-h-[160px] leading-relaxed"
          />
          <div className="flex items-center gap-1 shrink-0">
            <button className="p-1.5 rounded hover:bg-accent transition-colors">
              <Paperclip className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={handleSend}
              disabled={!content.trim()}
              className="p-1.5 rounded bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
