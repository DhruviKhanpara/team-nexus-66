/**
 * NotificationList — renders notifications, clickable to navigate.
 *
 * Uses useNavigateChat use case hook.
 */

import { useMemo, useCallback } from 'react';
import { notifications, userMap } from '@/data/mockData';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { AtSign, MessageSquare, SmilePlus, Mail, Users, Bell } from 'lucide-react';
import type { NotificationType, Notification } from '@/types';
import { getInitials } from '@/lib/helpers';
import { useNavigateChat } from '@/domain/chat';

const iconMap: Record<NotificationType, typeof AtSign> = {
  mention: AtSign,
  thread_reply: MessageSquare,
  reaction: SmilePlus,
  dm: Mail,
  group_message: Users,
  added_to_team: Users,
  added_to_channel: Bell,
  added_to_group: Users,
};

const NotificationList = () => {
  const { navigateToChat } = useNavigateChat();

  const sorted = useMemo(
    () => [...notifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [],
  );

  const handleClick = useCallback((notif: Notification) => {
    if (notif.channelId) {
      navigateToChat('channel', notif.channelId);
    } else if (notif.conversationId) {
      navigateToChat('conversation', notif.conversationId);
    }
  }, [navigateToChat]);

  return (
    <div className="space-y-0.5">
      {sorted.map(notif => {
        const actor = notif.actorId ? userMap[notif.actorId] : null;
        const Icon = iconMap[notif.type] || Bell;

        return (
          <div
            key={notif._id}
            onClick={() => handleClick(notif)}
            className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent/50 ${
              !notif.isRead ? 'bg-accent/30' : ''
            }`}
          >
            <Avatar className="w-8 h-8 shrink-0 mt-0.5">
              <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">
                {getInitials(actor?.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-sm font-medium text-foreground truncate">
                  {actor?.name || 'Someone'}
                </span>
              </div>
              {notif.preview && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {notif.preview}
                </p>
              )}
              <span className="text-[11px] text-muted-foreground mt-1 block">
                {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
              </span>
            </div>

            {!notif.isRead && <span className="unread-dot mt-2 shrink-0" />}
          </div>
        );
      })}
    </div>
  );
};

export default NotificationList;
