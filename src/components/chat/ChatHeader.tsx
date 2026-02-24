import { useAppSelector } from '@/app/store';
import { channels, teams, conversations, userMap } from '@/data/mockData';
import { Hash, Megaphone, Lock, Users, Pin, Info } from 'lucide-react';

const ChatHeader = () => {
  const { activeChatContext } = useAppSelector(s => s.ui);
  const currentUser = useAppSelector(s => s.auth.user);

  if (!activeChatContext) return null;

  let name = '';
  let description = '';
  let icon: React.ReactNode = null;
  let memberCount = 0;

  if (activeChatContext.type === 'channel') {
    const channel = channels.find(c => c._id === activeChatContext.id);
    if (channel) {
      const team = teams.find(t => t._id === channel.teamId);
      name = channel.name;
      description = channel.description || '';
      memberCount = channel.memberCount;
      const IconComp = channel.type === 'announcement' ? Megaphone : channel.isPrivate ? Lock : Hash;
      icon = <IconComp className="w-5 h-5 text-muted-foreground" />;
    }
  } else {
    const conv = conversations.find(c => c._id === activeChatContext.id);
    if (conv) {
      if (conv.type === 'group') {
        name = conv.name || 'Group Chat';
        memberCount = conv.participants.length;
        icon = <Users className="w-5 h-5 text-muted-foreground" />;
      } else {
        const other = conv.participants.find(p => p.userId !== currentUser?._id);
        const otherUser = other ? userMap[other.userId] : null;
        name = otherUser?.name || 'Unknown';
      }
    }
  }

  return (
    <header className="h-14 min-h-[56px] border-b border-border flex items-center justify-between px-4 md:px-6 bg-card">
      <div className="flex items-center gap-2 min-w-0">
        {icon}
        <h1 className="text-base font-semibold text-card-foreground truncate">{name}</h1>
        {description && (
          <span className="hidden md:inline text-xs text-muted-foreground truncate max-w-[200px] border-l border-border pl-2 ml-1">
            {description}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1">
        {memberCount > 0 && (
          <span className="text-xs text-muted-foreground flex items-center gap-1 mr-2">
            <Users className="w-3.5 h-3.5" />
            {memberCount}
          </span>
        )}
        <button className="p-2 rounded-md hover:bg-accent transition-colors">
          <Pin className="w-4 h-4 text-muted-foreground" />
        </button>
        <button className="p-2 rounded-md hover:bg-accent transition-colors">
          <Info className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;
