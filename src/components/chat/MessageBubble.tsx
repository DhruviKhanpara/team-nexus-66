import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/store';
import { toggleReaction, softDeleteMessage } from '@/features/chatSlice';
import { setActiveThread } from '@/features/uiSlice';
import { userMap, currentUser } from '@/data/mockData';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, SmilePlus, MoreHorizontal, Pencil, Trash2, Pin } from 'lucide-react';
import { format } from 'date-fns';
import type { Message } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const QUICK_EMOJIS = ['👍', '❤️', '😂', '🎉', '🚀', '👀'];

interface Props {
  message: Message;
  showAvatar: boolean;
  isThread?: boolean;
}

const MessageBubble = ({ message, showAvatar, isThread }: Props) => {
  const { activeChatContext } = useAppSelector(s => s.ui);
  const dispatch = useAppDispatch();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const sender = userMap[message.senderId];
  const isOwn = message.senderId === currentUser._id;
  const contextId = activeChatContext?.id || '';

  if (message.deletedAt) {
    return (
      <div className={`py-1 ${showAvatar ? 'mt-3' : ''}`}>
        <p className="text-xs text-muted-foreground italic pl-12">This message was deleted.</p>
      </div>
    );
  }

  const handleReaction = (emoji: string) => {
    dispatch(toggleReaction({ contextId, messageId: message._id, emoji, userId: currentUser._id }));
    setShowEmojiPicker(false);
  };

  const handleDelete = () => {
    dispatch(softDeleteMessage({ contextId, messageId: message._id, userId: currentUser._id }));
  };

  const handleOpenThread = () => {
    dispatch(setActiveThread(message._id));
  };

  return (
    <div className={`chat-message-hover group rounded-md px-2 py-0.5 ${showAvatar ? 'mt-3' : ''}`}>
      <div className="flex gap-3">
        {/* Avatar or spacer */}
        <div className="w-8 shrink-0">
          {showAvatar && (
            <Avatar className="w-8 h-8">
              <AvatarFallback className="text-xs font-semibold bg-secondary text-secondary-foreground">
                {sender?.name?.split(' ').map(n => n[0]).join('') || '?'}
              </AvatarFallback>
            </Avatar>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {showAvatar && (
            <div className="flex items-baseline gap-2 mb-0.5">
              <span className="text-sm font-semibold text-foreground">
                {sender?.name || 'Unknown'}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {format(new Date(message.createdAt), 'h:mm a')}
              </span>
              {message.isEdited && (
                <span className="text-[10px] text-muted-foreground">(edited)</span>
              )}
            </div>
          )}

          <p className="text-sm text-foreground whitespace-pre-wrap break-words leading-relaxed">
            {message.content}
          </p>

          {/* Reactions */}
          {message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {message.reactions.map(reaction => (
                <button
                  key={reaction.emoji}
                  onClick={() => handleReaction(reaction.emoji)}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-colors ${
                    reaction.users.includes(currentUser._id)
                      ? 'bg-primary/10 border-primary/30 text-primary'
                      : 'bg-muted border-border text-muted-foreground hover:bg-accent'
                  }`}
                >
                  <span>{reaction.emoji}</span>
                  <span className="font-medium">{reaction.count}</span>
                </button>
              ))}
            </div>
          )}

          {/* Thread indicator */}
          {!isThread && message.replyCount > 0 && (
            <button
              onClick={handleOpenThread}
              className="flex items-center gap-1.5 mt-1.5 text-xs text-primary hover:underline"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              {message.replyCount} {message.replyCount === 1 ? 'reply' : 'replies'}
            </button>
          )}
        </div>

        {/* Hover actions */}
        <div className="message-actions flex items-start gap-0.5 pt-0.5">
          {/* Emoji react */}
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-1 rounded hover:bg-accent transition-colors"
            >
              <SmilePlus className="w-4 h-4 text-muted-foreground" />
            </button>
            {showEmojiPicker && (
              <div className="absolute right-0 top-full mt-1 z-50 bg-popover border border-border rounded-lg shadow-lg p-2 flex gap-1 animate-fade-in">
                {QUICK_EMOJIS.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(emoji)}
                    className="w-8 h-8 flex items-center justify-center rounded hover:bg-accent text-base transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Thread reply */}
          {!isThread && (
            <button
              onClick={handleOpenThread}
              className="p-1 rounded hover:bg-accent transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
            </button>
          )}

          {/* More menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded hover:bg-accent transition-colors">
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem className="gap-2 text-xs">
                <Pin className="w-3.5 h-3.5" /> Pin message
              </DropdownMenuItem>
              {isOwn && (
                <>
                  <DropdownMenuItem className="gap-2 text-xs">
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="gap-2 text-xs text-destructive">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
