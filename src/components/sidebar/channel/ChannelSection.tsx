import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setActiveChatContext } from '@/features/uiSlice';
import {
  selectActiveChatContext,
  selectReadStates,
  selectSearchQuery,
} from '@/features/selectors';
import { channels as mockChannels } from '@/data/mockData';
import ChannelList from './ChannelList';

interface ChannelSectionProps {
  teamId: string;
}

/**
 * Container for the channels of a single team.
 *
 * Channels are still backed by mock data; swapping in the real Channel API
 * later only requires changing the data source in this file.
 */
const ChannelSection = ({ teamId }: ChannelSectionProps) => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(selectSearchQuery);
  const activeChatContext = useAppSelector(selectActiveChatContext);
  const readStates = useAppSelector(selectReadStates);

  const channels = useMemo(() => {
    const teamChannels = mockChannels.filter(
      (c) => c.teamId === teamId && !c.isArchived,
    );
    if (!searchQuery) return teamChannels;
    return teamChannels.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [teamId, searchQuery]);

  const getUnreadCount = useCallback(
    (channelId: string) =>
      readStates.find((r) => r.channelId === channelId)?.unreadCount || 0,
    [readStates],
  );

  const handleSelect = useCallback(
    (channelId: string) => {
      dispatch(setActiveChatContext({ type: 'channel', id: channelId }));
    },
    [dispatch],
  );

  const activeChannelId =
    activeChatContext?.type === 'channel' ? activeChatContext.id : null;

  return (
    <ChannelList
      channels={channels}
      activeChannelId={activeChannelId}
      getUnreadCount={getUnreadCount}
      onSelect={handleSelect}
    />
  );
};

export default ChannelSection;
