import { useCallback, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setSelectedTeamId } from '@/features/teamSlice';
import {
  selectSearchQuery,
  selectSelectedOrgId,
  selectSelectedTeamId,
  selectTeamsForSelectedOrg,
} from '@/features/selectors';
import { SidebarEmptyState, SidebarSection } from '@/components/sidebar/primitives';
import ChannelSection from '@/components/sidebar/channel/ChannelSection';
import CreateTeamButton from './CreateTeamButton';
import TeamList from './TeamList';
import CreateTeamDialog from '@/components/team/CreateTeamDialog';
import EditTeamDialog from '@/components/team/EditTeamDialog';
import type { TeamSummaryVO } from '@/types/team';

/**
 * Container for the Teams area of the sidebar.
 * Owns team-scoped UI state and dialogs — no data fetching happens here.
 * Only the selected team renders its channels (channels are loaded per team).
 */
const TeamSection = () => {
  const dispatch = useAppDispatch();
  const selectedOrgId = useAppSelector(selectSelectedOrgId);
  const selectedTeamId = useAppSelector(selectSelectedTeamId);
  const teams = useAppSelector(selectTeamsForSelectedOrg);
  const searchQuery = useAppSelector(selectSearchQuery);

  const [createTeamOpen, setCreateTeamOpen] = useState(false);
  const [editTeam, setEditTeam] = useState<TeamSummaryVO | null>(null);

  // Expanding a team selects it; collapsing clears the selection.
  const toggleTeam = useCallback(
    (teamId: string) => {
      dispatch(setSelectedTeamId(selectedTeamId === teamId ? null : teamId));
    },
    [dispatch, selectedTeamId],
  );

  const isExpanded = useCallback(
    (teamId: string) => selectedTeamId === teamId,
    [selectedTeamId],
  );

  const filteredTeams = useMemo(
    () =>
      teams.filter(
        (t) => !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [teams, searchQuery],
  );

  if (!selectedOrgId) {
    return <SidebarEmptyState message="Select an organization to view its teams." />;
  }

  return (
    <>
      <SidebarSection
        label="Teams"
        action={<CreateTeamButton onClick={() => setCreateTeamOpen(true)} />}
      >
        {filteredTeams.length === 0 ? (
          <SidebarEmptyState message="No teams found." />
        ) : (
          <TeamList
            teams={filteredTeams}
            isExpanded={isExpanded}
            onToggle={toggleTeam}
            onEdit={setEditTeam}
            renderTeamContent={(team) =>
              team.id === selectedTeamId ? (
                <ChannelSection teamId={team.id} />
              ) : null
            }
          />
        )}
      </SidebarSection>

      <CreateTeamDialog
        open={createTeamOpen}
        onOpenChange={setCreateTeamOpen}
        orgId={selectedOrgId}
      />
      {editTeam && (
        <EditTeamDialog
          open={!!editTeam}
          onOpenChange={(o) => !o && setEditTeam(null)}
          team={editTeam}
        />
      )}
    </>
  );
};

export default TeamSection;
