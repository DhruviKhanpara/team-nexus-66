import type { ReactNode } from 'react';
import { SidebarGroup } from '@/components/sidebar/primitives';
import TeamActions from './TeamActions';
import type { TeamSummaryVO } from '@/types/team';

interface TeamItemProps {
  team: TeamSummaryVO;
  expanded: boolean;
  onToggle: (teamId: string) => void;
  onEdit: (team: TeamSummaryVO) => void;
  /** Content nested under the team (e.g. its channel section). */
  children?: ReactNode;
}

/** Renders a single team row. Knows nothing about what is nested inside it. */
const TeamItem = ({ team, expanded, onToggle, onEdit, children }: TeamItemProps) => (
  <SidebarGroup
    label={team.name}
    expanded={expanded}
    onToggle={() => onToggle(team.id)}
    leading={
      <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold bg-primary text-primary-foreground">
        {team.name[0]}
      </div>
    }
    actions={<TeamActions teamName={team.name} onEdit={() => onEdit(team)} />}
  >
    {children}
  </SidebarGroup>
);

export default TeamItem;
