import ChannelItem from './ChannelItem';
import type { ChannelSummaryVO } from '@/types/channel';

interface ChannelListProps {
  channels: ChannelSummaryVO[];
  activeChannelId: string | null;
  getUnreadCount: (channel: ChannelSummaryVO) => number;
  onSelect: (channelId: string) => void;
  onEdit: (channel: ChannelSummaryVO) => void;
}

/** Pure presentation: renders a collection of channels. */
const ChannelList = ({
  channels,
  activeChannelId,
  getUnreadCount,
  onSelect,
  onEdit,
}: ChannelListProps) => (
  <>
    {channels.map((channel) => (
      <ChannelItem
        key={channel.id}
        channel={channel}
        isActive={activeChannelId === channel.id}
        unreadCount={getUnreadCount(channel)}
        onSelect={onSelect}
        onEdit={onEdit}
      />
    ))}
  </>
);

export default ChannelList;
