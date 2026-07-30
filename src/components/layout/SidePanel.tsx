import { useAppSelector } from '@/app/store';
import SidebarHeader from '@/components/sidebar/SidebarHeader';
import SidebarContent from '@/components/sidebar/SidebarContent';
import TeamSection from '@/components/sidebar/team/TeamSection';
import ConversationSection from '@/components/sidebar/conversation/ConversationSection';
import ActivityFeed from '@/components/sidebar/ActivityFeed';
import NotificationList from '@/components/sidebar/NotificationList';
import { SIDE_PANEL_TITLES } from '@/lib/constants';

const SidePanel = () => {
  const { activeNav } = useAppSelector(s => s.ui);

  return (
    <aside className="h-full w-[300px] border-r border-border bg-sidebar flex flex-col">
      <SidebarHeader title={SIDE_PANEL_TITLES[activeNav]} />

      <SidebarContent>
        {activeNav === 'teams' && <TeamSection />}
        {activeNav === 'chat' && <ConversationSection />}
        {activeNav === 'activity' && <ActivityFeed />}
        {activeNav === 'notifications' && <NotificationList />}
      </SidebarContent>
    </aside>
  );
};

export default SidePanel;
