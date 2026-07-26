import { useCallback, useMemo, useState } from 'react';
import { useAppSelector } from '@/app/store';
import {
  selectSearchQuery,
  selectSelectedOrgId,
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
 */
const TeamSection = () => {
  const selectedOrgId = useAppSelector(selectSelectedOrgId);
  const teams = useAppSelector(selectTeamsForSelectedOrg);
  const searchQuery = useAppSelector(selectSearchQuery);

  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({});
  const [createTeamOpen, setCreateTeamOpen] = useState(false);
  const [editTeam, setEditTeam] = useState<TeamSummaryVO | null>(null);

  const toggleTeam = useCallback((teamId: string) => {
    setExpandedTeams((prev) => ({ ...prev, [teamId]: !(prev[teamId] ?? true) }));
  }, []);

  const isExpanded = useCallback(
    (teamId: string) => expandedTeams[teamId] ?? true,
    [expandedTeams],
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
            renderTeamContent={(team) => <ChannelSection teamId={team.id} />}
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
