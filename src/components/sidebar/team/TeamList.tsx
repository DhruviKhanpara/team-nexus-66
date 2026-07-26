import type { ReactNode } from 'react';
import TeamItem from './TeamItem';
import type { TeamSummaryVO } from '@/types/team';

interface TeamListProps {
  teams: TeamSummaryVO[];
  isExpanded: (teamId: string) => boolean;
  onToggle: (teamId: string) => void;
  onEdit: (team: TeamSummaryVO) => void;
  /** Optional content rendered inside each expanded team. */
  renderTeamContent?: (team: TeamSummaryVO) => ReactNode;
}

/** Pure presentation: renders a collection of teams. */
const TeamList = ({
  teams,
  isExpanded,
  onToggle,
  onEdit,
  renderTeamContent,
}: TeamListProps) => (
  <div className="space-y-1">
    {teams.map((team) => (
      <TeamItem
        key={team.id}
        team={team}
        expanded={isExpanded(team.id)}
        onToggle={onToggle}
        onEdit={onEdit}
      >
        {renderTeamContent?.(team)}
      </TeamItem>
    ))}
  </div>
);

export default TeamList;
