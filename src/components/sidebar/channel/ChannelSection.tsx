import { useCallback, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setActiveChatContext } from '@/features/uiSlice';
import { setSelectedChannelId } from '@/features/channelSlice';
import {
  selectActiveChatContext,
  selectChannelsForSelectedTeam,
  selectSearchQuery,
  selectSelectedOrgId,
} from '@/features/selectors';
import { SidebarEmptyState } from '@/components/sidebar/primitives';
import ChannelList from './ChannelList';
import CreateChannelButton from './CreateChannelButton';
import CreateChannelDialog from '@/components/channel/CreateChannelDialog';
import EditChannelDialog from '@/components/channel/EditChannelDialog';
import type { ChannelSummaryVO } from '@/types/channel';

interface ChannelSectionProps {
  teamId: string;
}

/**
 * Container for the channels of the currently selected team.
 * Data is hydrated in AppLayout; this component only reads from Redux.
 */
const ChannelSection = ({ teamId }: ChannelSectionProps) => {
  const dispatch = useAppDispatch();
  const orgId = useAppSelector(selectSelectedOrgId);
  const searchQuery = useAppSelector(selectSearchQuery);
  const activeChatContext = useAppSelector(selectActiveChatContext);
  const allChannels = useAppSelector(selectChannelsForSelectedTeam);

  const [createOpen, setCreateOpen] = useState(false);
  const [editChannel, setEditChannel] = useState<ChannelSummaryVO | null>(null);

  const channels = useMemo(() => {
    const visible = allChannels.filter((c) => !c.isArchived);
    if (!searchQuery) return visible;
    return visible.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [allChannels, searchQuery]);

  const getUnreadCount = useCallback(
    (channel: ChannelSummaryVO) => channel.unreadCount,
    [],
  );

  const handleSelect = useCallback(
    (channelId: string) => {
      dispatch(setSelectedChannelId(channelId));
      dispatch(setActiveChatContext({ type: 'channel', id: channelId }));
    },
    [dispatch],
  );

  const activeChannelId =
    activeChatContext?.type === 'channel' ? activeChatContext.id : null;

  return (
    <>
      <div className="flex items-center justify-between px-2 pt-1">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Channels
        </span>
        <CreateChannelButton onClick={() => setCreateOpen(true)} />
      </div>

      {channels.length === 0 ? (
        <SidebarEmptyState message="No channels yet." />
      ) : (
        <ChannelList
          channels={channels}
          activeChannelId={activeChannelId}
          getUnreadCount={getUnreadCount}
          onSelect={handleSelect}
          onEdit={setEditChannel}
        />
      )}

      {orgId && (
        <CreateChannelDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          orgId={orgId}
          teamId={teamId}
        />
      )}
      {editChannel && (
        <EditChannelDialog
          open={!!editChannel}
          onOpenChange={(o) => !o && setEditChannel(null)}
          channel={editChannel}
        />
      )}
    </>
  );
};

export default ChannelSection;
