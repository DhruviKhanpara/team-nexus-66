import { useAppSelector } from '@/app/store';
import { selectChannelById, selectConversationById } from '@/features/selectors';
import { Hash, Megaphone, Lock, Users, Pin, Info } from 'lucide-react';
import { useMemo } from 'react';
import type { RootState } from '@/app/store';

const ChatHeader = () => {
  const { activeChatContext } = useAppSelector(s => s.ui);
  const activeChannel = useAppSelector(s =>
    selectChannelById(s, activeChatContext?.type === 'channel' ? activeChatContext.id : null),
  );
  const activeConversation = useAppSelector((s: RootState) =>
    selectConversationById(
      s,
      activeChatContext?.type === 'conversation' ? activeChatContext.id : null,
    ),
  );

  const headerData = useMemo(() => {
    if (!activeChatContext) return null;

    let name = '';
    let description = '';
    let icon: React.ReactNode = null;
    let memberCount = 0;

    if (activeChatContext.type === 'channel') {
      if (activeChannel) {
        name = activeChannel.name;
        description = activeChannel.description || '';
        memberCount = activeChannel.memberCount;
        const IconComp =
          activeChannel.type === 'announcement'
            ? Megaphone
            : activeChannel.isPrivate
              ? Lock
              : Hash;
        icon = <IconComp className="w-5 h-5 text-muted-foreground" />;
      }
    } else if (activeConversation) {
      name = activeConversation.displayName;
      if (activeConversation.isGroup) {
        memberCount = activeConversation.participantCount;
        icon = <Users className="w-5 h-5 text-muted-foreground" />;
      }
    }

    return { name, description, icon, memberCount };
  }, [activeChatContext, activeChannel, activeConversation]);

  if (!headerData) return null;

  const { name, description, icon, memberCount } = headerData;

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
