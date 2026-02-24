import { useAppSelector } from '@/app/store';
import TeamChannelList from '@/components/sidebar/TeamChannelList';
import ConversationList from '@/components/sidebar/ConversationList';
import ActivityFeed from '@/components/sidebar/ActivityFeed';
import NotificationList from '@/components/sidebar/NotificationList';
import SearchBar from '@/components/sidebar/SearchBar';

const SidePanel = () => {
  const { activeNav } = useAppSelector(s => s.ui);

  const titles: Record<string, string> = {
    activity: 'Activity',
    chat: 'Chat',
    teams: 'Teams',
    notifications: 'Notifications',
  };

  return (
    <aside className="h-full w-[300px] border-r border-border bg-sidebar flex flex-col">
      {/* Header */}
      <div className="p-4 pb-2">
        <h2 className="text-lg font-semibold text-sidebar-foreground">{titles[activeNav]}</h2>
        <SearchBar />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {activeNav === 'teams' && <TeamChannelList />}
        {activeNav === 'chat' && <ConversationList />}
        {activeNav === 'activity' && <ActivityFeed />}
        {activeNav === 'notifications' && <NotificationList />}
      </div>
    </aside>
  );
};

export default SidePanel;
