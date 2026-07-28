/**
 * MessageInput — chat text input with formatting toolbar.
 *
 * Sends through the message domain use case (backend-driven).
 */

import { useState, useRef, useCallback } from 'react';
import { Send, Paperclip, SmilePlus, AtSign, Bold, Italic, Code } from 'lucide-react';
import { useAppSelector } from '@/app/store';
import { usePersistSendMessage } from '@/domain/message';
import {
  selectSelectedChannelId,
  selectSelectedOrgId,
  selectSelectedTeamId,
} from '@/features/selectors';

interface MessageInputProps {
  threadId?: string;
  onSend?: () => void;
}

const MessageInput = ({ threadId, onSend }: MessageInputProps) => {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const orgId = useAppSelector(selectSelectedOrgId);
  const teamId = useAppSelector(selectSelectedTeamId);
  const channelId = useAppSelector(selectSelectedChannelId);
  const { sendMessage, isSending } = usePersistSendMessage();

  const handleSend = useCallback(async () => {
    if (!orgId || !teamId || !channelId) return;
    if (!content.trim() || isSending) return;

    const success = await sendMessage({
      orgId,
      teamId,
      channelId,
      content,
      threadRootMessageId: threadId ?? null,
    });

    if (success) {
      setContent('');
      onSend?.();
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  }, [orgId, teamId, channelId, content, isSending, sendMessage, threadId, onSend]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  }, []);

  return (
    <div className="px-4 md:px-6 pb-4 pt-2">
      <div className="border border-border rounded-lg bg-card overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/50 transition-all">
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
