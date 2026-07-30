import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { ConversationVO } from '@/types/conversation';

interface ConversationItemProps {
  conversation: ConversationVO;
  isActive: boolean;
  onSelect: (conversationId: string) => void;
}

/** Single conversation row (direct or group). Presentation only. */
const ConversationItem = ({
  conversation,
  isActive,
  onSelect,
}: ConversationItemProps) => {
  const unread = conversation.unreadCount;

  return (
    <button
      onClick={() => onSelect(conversation.id)}
      className={`flex items-center gap-3 w-full p-2.5 rounded-lg transition-colors ${
        isActive ? 'bg-accent' : 'hover:bg-accent/50'
      }`}
    >
      <div className="relative shrink-0">
        {conversation.isGroup ? (
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
        ) : (
          <Avatar className="w-10 h-10">
            {conversation.avatarUrl && (
              <AvatarImage src={conversation.avatarUrl} alt={conversation.displayName} />
            )}
            <AvatarFallback className="text-xs font-semibold bg-secondary text-secondary-foreground">
              {conversation.initials}
            </AvatarFallback>
          </Avatar>
        )}
      </div>

      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`text-sm truncate ${
              unread > 0
                ? 'font-semibold text-foreground'
                : 'font-medium text-sidebar-foreground'
            }`}
          >
            {conversation.displayName}
          </span>
          {conversation.lastMessageAt && (
            <span className="text-[11px] text-muted-foreground shrink-0">
              {formatDistanceToNow(new Date(conversation.lastMessageAt), {
                addSuffix: false,
              })}
            </span>
          )}
        </div>
        {conversation.isGroup && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {conversation.participantCount} members
          </p>
        )}
      </div>

      {unread > 0 && (
        <span className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center bg-primary text-primary-foreground shrink-0">
          {unread}
        </span>
      )}
    </button>
  );
};

export default ConversationItem;
