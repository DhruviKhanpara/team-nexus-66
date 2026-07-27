import { Pencil } from 'lucide-react';

interface ChannelActionsProps {
  channelName: string;
  onEdit: () => void;
}

/** Hover actions for a single channel row. */
const ChannelActions = ({ channelName, onEdit }: ChannelActionsProps) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onEdit();
    }}
    className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-accent-foreground/10"
    aria-label={`Edit ${channelName}`}
  >
    <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
  </button>
);

export default ChannelActions;
