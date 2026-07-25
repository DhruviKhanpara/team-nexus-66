import { useState } from 'react';
import { ChevronRight, Hash, Megaphone, Lock, Plus, Pencil } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/app/store';
import { setActiveChatContext } from '@/features/uiSlice';
import { channels } from '@/data/mockData';
import { useHydrateTeams } from '@/domain/team';
import type { TeamSummaryVO } from '@/types/team';
import CreateTeamDialog from '@/components/team/CreateTeamDialog';
import EditTeamDialog from '@/components/team/EditTeamDialog';

const TeamChannelList = () => {
  const { activeChatContext, searchQuery } = useAppSelector(s => s.ui);
  const { readStates } = useAppSelector(s => s.chat);
  const selectedOrgId = useAppSelector(s => s.organization.selectedOrgId);
  const teamsByOrgId = useAppSelector(s => s.team.teamsByOrgId);
  const dispatch = useAppDispatch();

  // Fetch + hydrate teams for the selected org
  useHydrateTeams(selectedOrgId);

  const teams: TeamSummaryVO[] = selectedOrgId
    ? teamsByOrgId[selectedOrgId] ?? []
    : [];

  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({});
  const [createTeamOpen, setCreateTeamOpen] = useState(false);
  const [editTeam, setEditTeam] = useState<TeamSummaryVO | null>(null);

  const toggleTeam = (teamId: string) => {
    setExpandedTeams(prev => ({ ...prev, [teamId]: !(prev[teamId] ?? true) }));
  };

  const filteredTeams = teams.filter(t =>
    !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUnreadCount = (channelId: string) => {
    const rs = readStates.find(r => r.channelId === channelId);
    return rs?.unreadCount || 0;
  };

  const getChannelIcon = (channel: typeof channels[0]) => {
    if (channel.type === 'announcement') return Megaphone;
    if (channel.isPrivate) return Lock;
    return Hash;
  };

  if (!selectedOrgId) {
    return (
      <div className="px-3 py-6 text-xs text-muted-foreground">
        Select an organization to view its teams.
      </div>
    );
  }

  if (filteredTeams.length === 0) {
    return (
      <div className="px-3 py-6 text-xs text-muted-foreground">
        No teams found.
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {filteredTeams.map(team => {
        const isExpanded = expandedTeams[team.id] ?? true;
        const teamChannels = channels.filter(c => c.teamId === team.id && !c.isArchived);
        const filteredChannels = searchQuery
          ? teamChannels.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
          : teamChannels;

        return (
          <div key={team.id}>
            {/* Team header */}
            <button
              onClick={() => toggleTeam(team.id)}
              className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md hover:bg-accent transition-colors group"
            >
              <ChevronRight
                className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-150 ${
                  isExpanded ? 'rotate-90' : ''
                }`}
              />
              <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold bg-primary text-primary-foreground">
                {team.name[0]}
              </div>
              <span className="text-sm font-medium text-sidebar-foreground flex-1 text-left truncate">
                {team.name}
              </span>
              <Plus className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            {/* Channels */}
            {isExpanded && (
              <div className="ml-6 mt-0.5 space-y-px">
                {filteredChannels.map(channel => {
                  const Icon = getChannelIcon(channel);
                  const unread = getUnreadCount(channel._id);
                  const isActive = activeChatContext?.type === 'channel' && activeChatContext.id === channel._id;

                  return (
                    <button
                      key={channel._id}
                      onClick={() => dispatch(setActiveChatContext({ type: 'channel', id: channel._id }))}
                      className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm transition-colors ${
                        isActive
                          ? 'bg-accent text-accent-foreground font-medium'
                          : 'text-sidebar-foreground hover:bg-accent/50'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className={`truncate flex-1 text-left ${unread > 0 ? 'font-semibold' : ''}`}>
                        {channel.name}
                      </span>
                      {unread > 0 && (
                        <span className="unread-dot shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TeamChannelList;
