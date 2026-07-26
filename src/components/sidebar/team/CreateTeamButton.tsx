import { Plus } from 'lucide-react';

interface CreateTeamButtonProps {
  onClick: () => void;
}

const CreateTeamButton = ({ onClick }: CreateTeamButtonProps) => (
  <button
    onClick={onClick}
    className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
    aria-label="Create team"
  >
    <Plus className="w-4 h-4" />
  </button>
);

export default CreateTeamButton;
