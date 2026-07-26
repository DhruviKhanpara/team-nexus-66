import { Hash, Lock, Megaphone } from 'lucide-react';
import { SidebarItem } from '@/components/sidebar/primitives';
import type { Channel } from '@/types';

interface ChannelItemProps {
  channel: Channel;
  isActive: boolean;
  unreadCount: number;
  onSelect: (channelId: string) => void;
}

const getChannelIcon = (channel: Channel) => {
  if (channel.type === 'announcement') return Megaphone;
  if (channel.isPrivate) return Lock;
  return Hash;
};

const ChannelItem = ({ channel, isActive, unreadCount, onSelect }: ChannelItemProps) => (
  <SidebarItem
    label={channel.name}
    icon={getChannelIcon(channel)}
    isActive={isActive}
    isUnread={unreadCount > 0}
    trailing={unreadCount > 0 ? <span className="unread-dot shrink-0" /> : undefined}
    onClick={() => onSelect(channel._id)}
  />
);

export default ChannelItem;
