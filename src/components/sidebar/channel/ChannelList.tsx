import ChannelItem from './ChannelItem';
import type { Channel } from '@/types';

interface ChannelListProps {
  channels: Channel[];
  activeChannelId: string | null;
  getUnreadCount: (channelId: string) => number;
  onSelect: (channelId: string) => void;
}

/** Pure presentation: renders a collection of channels. */
const ChannelList = ({
  channels,
  activeChannelId,
  getUnreadCount,
  onSelect,
}: ChannelListProps) => (
  <>
    {channels.map((channel) => (
      <ChannelItem
        key={channel._id}
        channel={channel}
        isActive={activeChannelId === channel._id}
        unreadCount={getUnreadCount(channel._id)}
        onSelect={onSelect}
      />
    ))}
  </>
);

export default ChannelList;
