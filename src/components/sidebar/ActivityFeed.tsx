import { notifications, userMap } from '@/data/mockData';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { getInitials } from '@/lib/helpers';
import { getActivityLabel } from '@/domain/chat';
import { useMemo } from 'react';

const ActivityFeed = () => {
  const sorted = useMemo(
    () => [...notifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [],
  );

  if (sorted.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>;
  }

  return (
    <div className="space-y-0.5">
      {sorted.map(notif => {
        const actor = notif.actorId ? userMap[notif.actorId] : null;

        return (
          <div
            key={notif._id}
            className="flex items-start gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
          >
            <Avatar className="w-8 h-8 shrink-0 mt-0.5">
              <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">
                {getInitials(actor?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">{getActivityLabel(notif.type, actor?.name)}</p>
              {notif.preview && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.preview}</p>
              )}
              <span className="text-[11px] text-muted-foreground mt-1 block">
                {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityFeed;
