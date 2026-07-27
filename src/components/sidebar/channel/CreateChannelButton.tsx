import { Plus } from 'lucide-react';

interface CreateChannelButtonProps {
  onClick: () => void;
}

const CreateChannelButton = ({ onClick }: CreateChannelButtonProps) => (
  <button
    onClick={onClick}
    className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
    aria-label="Create channel"
  >
    <Plus className="w-3.5 h-3.5" />
  </button>
);

export default CreateChannelButton;
