import { useAppSelector, useAppDispatch } from '@/app/store';
import { setActiveChatContext } from '@/features/uiSlice';
import { conversations, userMap, statusMap } from '@/data/mockData';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Users } from 'lucide-react';
import { useMemo, useCallback } from 'react';
import { getInitials } from '@/lib/helpers';
import { getConversationDisplayName } from '@/domain/chat';
import type { ChatContext } from '@/types';

const getPresenceColor = (userId: string | undefined): string => {
  if (!userId) return '';
  const status = statusMap[userId];
  if (!status) return 'bg-status-offline';
  switch (status.presence) {
    case 'online': return 'bg-status-online';
    case 'away': return 'bg-status-away';
    default: return 'bg-status-offline';
  }
};

const ConversationList = () => {
  const { activeChatContext, searchQuery } = useAppSelector(s => s.ui);
  const currentUser = useAppSelector(s => s.auth.user);
  const { readStates } = useAppSelector(s => s.chat);
  const dispatch = useAppDispatch();

  const handleSelect = useCallback((ctx: ChatContext) => {
    dispatch(setActiveChatContext(ctx));
  }, [dispatch]);

  const filtered = useMemo(() => {
    const sorted = [...conversations].sort((a, b) => {
      const aTime = a.lastMessage?.sentAt || a.createdAt;
      const bTime = b.lastMessage?.sentAt || b.createdAt;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });
    if (!searchQuery) return sorted;
    return sorted.filter(c =>
      getConversationDisplayName(c, currentUser?._id, userMap)
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, currentUser?._id]);

  return (
    <div className="space-y-0.5">
      {filtered.map(conv => {
        const name = getConversationDisplayName(conv, currentUser?._id, userMap);
        const isActive = activeChatContext?.type === 'conversation' && activeChatContext.id === conv._id;
        const otherUserId = conv.type === 'direct'
          ? conv.participants.find(p => p.userId !== currentUser?._id)?.userId
          : undefined;
        const unread = readStates.find(r => r.conversationId === conv._id)?.unreadCount || 0;
        const lastMsg = conv.lastMessage;
        const senderName = lastMsg?.senderId ? userMap[lastMsg.senderId]?.name?.split(' ')[0] : null;

        return (
          <button
            key={conv._id}
            onClick={() => handleSelect({ type: 'conversation', id: conv._id })}
            className={`flex items-center gap-3 w-full p-2.5 rounded-lg transition-colors ${
              isActive ? 'bg-accent' : 'hover:bg-accent/50'
            }`}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              {conv.type === 'group' ? (
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
              ) : (
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="text-xs font-semibold bg-secondary text-secondary-foreground">
                    {getInitials(name)}
                  </AvatarFallback>
                </Avatar>
              )}
              {otherUserId && (
                <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-sidebar ${getPresenceColor(otherUserId)}`} />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between gap-2">
                <span className={`text-sm truncate ${unread > 0 ? 'font-semibold text-foreground' : 'font-medium text-sidebar-foreground'}`}>
                  {name}
                </span>
                {lastMsg?.sentAt && (
                  <span className="text-[11px] text-muted-foreground shrink-0">
                    {formatDistanceToNow(new Date(lastMsg.sentAt), { addSuffix: false })}
                  </span>
                )}
              </div>
              {lastMsg?.content && (
                <p className={`text-xs truncate mt-0.5 ${unread > 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {conv.type === 'group' && senderName ? `${senderName}: ` : ''}
                  {lastMsg.content}
                </p>
              )}
            </div>

            {/* Unread indicator */}
            {unread > 0 && (
              <span className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center bg-primary text-primary-foreground shrink-0">
                {unread}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ConversationList;
