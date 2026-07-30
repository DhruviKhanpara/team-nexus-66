import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SearchInput } from '@/components/forms';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useHydrateOrganizationMembers } from '@/domain/organization';
import { usePersistCreateDirectConversation } from '@/domain/conversation';
import { selectSelectedOrgId } from '@/features/selectors';
import { setActiveChatContext } from '@/features/uiSlice';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Pick an organization member to start (or open) a direct conversation. */
const CreateDirectConversationDialog = ({ open, onOpenChange }: Props) => {
  const dispatch = useAppDispatch();
  const orgId = useAppSelector(selectSelectedOrgId);
  const currentUserId = useAppSelector((s) => s.auth.user?.id);
  const [search, setSearch] = useState('');

  const { members, isLoading } = useHydrateOrganizationMembers(
    open ? orgId : null,
  );
  const { createDirectConversation, isCreating } =
    usePersistCreateDirectConversation();

  useEffect(() => {
    if (!open) setSearch('');
  }, [open]);

  const candidates = useMemo(() => {
    const others = members.filter((m) => m.userId !== currentUserId);
    if (!search) return others;
    const term = search.toLowerCase();
    return others.filter(
      (m) =>
        m.name.toLowerCase().includes(term) ||
        m.username.toLowerCase().includes(term),
    );
  }, [members, search, currentUserId]);

  const handleSelect = async (userId: string) => {
    const conversation = await createDirectConversation(userId);
    if (conversation) {
      dispatch(
        setActiveChatContext({ type: 'conversation', id: conversation.id }),
      );
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New direct message</DialogTitle>
          <DialogDescription>
            Choose someone from your organization to chat with.
          </DialogDescription>
        </DialogHeader>

        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search people"
        />

        <div className="max-h-[320px] overflow-y-auto space-y-0.5">
          {isLoading && (
            <p className="text-sm text-muted-foreground px-2 py-4">Loading...</p>
          )}
          {!isLoading && candidates.length === 0 && (
            <p className="text-sm text-muted-foreground px-2 py-4">
              No people found.
            </p>
          )}
          {candidates.map((member) => (
            <button
              key={member.userId}
              disabled={isCreating}
              onClick={() => handleSelect(member.userId)}
              className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-accent transition-colors text-left disabled:opacity-50"
            >
              <Avatar className="w-8 h-8">
                {member.iconUrl && (
                  <AvatarImage src={member.iconUrl} alt={member.name} />
                )}
                <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">
                  {member.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{member.name}</p>
                {member.username && (
                  <p className="text-xs text-muted-foreground truncate">
                    @{member.username}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDirectConversationDialog;
