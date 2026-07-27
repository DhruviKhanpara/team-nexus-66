import { Hash, Lock, Megaphone } from 'lucide-react';
import { SidebarItem } from '@/components/sidebar/primitives';
import ChannelActions from './ChannelActions';
import type { ChannelSummaryVO } from '@/types/channel';

interface ChannelItemProps {
  channel: ChannelSummaryVO;
  isActive: boolean;
  unreadCount: number;
  onSelect: (channelId: string) => void;
  onEdit: (channel: ChannelSummaryVO) => void;
}

const getChannelIcon = (channel: ChannelSummaryVO) => {
  if (channel.type === 'announcement') return Megaphone;
  if (channel.isPrivate) return Lock;
  return Hash;
};

const ChannelItem = ({
  channel,
  isActive,
  unreadCount,
  onSelect,
  onEdit,
}: ChannelItemProps) => (
  <SidebarItem
    label={channel.name}
    icon={getChannelIcon(channel)}
    isActive={isActive}
    isUnread={unreadCount > 0}
    trailing={
      <div className="flex items-center gap-1 shrink-0">
        {unreadCount > 0 && <span className="unread-dot shrink-0" />}
        <ChannelActions
          channelName={channel.name}
          onEdit={() => onEdit(channel)}
        />
      </div>
    }
    onClick={() => onSelect(channel.id)}
  />
);

export default ChannelItem;
