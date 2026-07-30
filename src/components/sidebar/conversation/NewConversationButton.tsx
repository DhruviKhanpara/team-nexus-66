import { Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MessageSquare, Users } from 'lucide-react';

interface NewConversationButtonProps {
  onNewDirect: () => void;
  onNewGroup: () => void;
}

const NewConversationButton = ({
  onNewDirect,
  onNewGroup,
}: NewConversationButtonProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button
        className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
        aria-label="New conversation"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem onClick={onNewDirect}>
        <MessageSquare className="w-4 h-4 mr-2" />
        New direct message
      </DropdownMenuItem>
      <DropdownMenuItem onClick={onNewGroup}>
        <Users className="w-4 h-4 mr-2" />
        New group chat
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export default NewConversationButton;
