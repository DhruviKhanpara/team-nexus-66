import { notifications, userMap } from '@/data/mockData';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

const ActivityFeed = () => {
  const sorted = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const getActivityText = (notif: typeof notifications[0]) => {
    const actor = notif.actorId ? userMap[notif.actorId]?.name : 'Someone';
    switch (notif.type) {
      case 'mention': return `${actor} mentioned you`;
      case 'thread_reply': return `${actor} replied to a thread`;
      case 'reaction': return `${actor} reacted to your message`;
      case 'dm': return `${actor} sent you a message`;
      case 'group_message': return `${actor} sent a group message`;
      case 'added_to_team': return `${actor} added you to a team`;
      case 'added_to_channel': return `${actor} added you to a channel`;
      case 'added_to_group': return `${actor} added you to a group`;
      default: return 'New activity';
    }
  };

  return (
    <div className="space-y-0.5">
      {sorted.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
      )}
      {sorted.map(notif => {
        const actor = notif.actorId ? userMap[notif.actorId] : null;

        return (
          <div
            key={notif._id}
            className="flex items-start gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
          >
            <Avatar className="w-8 h-8 shrink-0 mt-0.5">
              <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">
                {actor?.name?.split(' ').map(n => n[0]).join('') || '?'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">{getActivityText(notif)}</p>
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
