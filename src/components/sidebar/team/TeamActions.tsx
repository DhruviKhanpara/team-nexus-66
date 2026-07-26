import { Pencil } from 'lucide-react';

interface TeamActionsProps {
  teamName: string;
  onEdit: () => void;
}

/** Hover actions for a single team row. */
const TeamActions = ({ teamName, onEdit }: TeamActionsProps) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onEdit();
    }}
    className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-accent-foreground/10"
    aria-label={`Edit ${teamName}`}
  >
    <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
  </button>
);

export default TeamActions;
