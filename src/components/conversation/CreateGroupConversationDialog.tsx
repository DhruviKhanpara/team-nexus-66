import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TextField, SearchInput } from '@/components/forms';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useHydrateOrganizationMembers } from '@/domain/organization';
import { usePersistCreateGroupConversation } from '@/domain/conversation';
import { selectSelectedOrgId } from '@/features/selectors';
import { setActiveChatContext } from '@/features/uiSlice';
import { MIN_GROUP_PARTICIPANTS } from '@/schemas/conversation.schema';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Create a group conversation from organization members. */
const CreateGroupConversationDialog = ({ open, onOpenChange }: Props) => {
  const dispatch = useAppDispatch();
  const orgId = useAppSelector(selectSelectedOrgId);
  const currentUserId = useAppSelector((s) => s.auth.user?.id);

  const [name, setName] = useState('');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { members, isLoading } = useHydrateOrganizationMembers(
    open ? orgId : null,
  );
  const { createGroupConversation, isCreating } =
    usePersistCreateGroupConversation();

  useEffect(() => {
    if (!open) {
      setName('');
      setSearch('');
      setSelectedIds([]);
    }
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

  const toggle = (userId: string) => {
    setSelectedIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const canSubmit =
    name.trim().length > 0 && selectedIds.length >= MIN_GROUP_PARTICIPANTS;

  const handleSubmit = async () => {
    const conversation = await createGroupConversation({
      name: name.trim(),
      participantUserIds: selectedIds,
    });
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
          <DialogTitle>New group chat</DialogTitle>
          <DialogDescription>
            Name the group and add at least {MIN_GROUP_PARTICIPANTS} people.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <TextField
            label="Group name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search people"
          />

          <div className="max-h-[260px] overflow-y-auto space-y-0.5">
            {isLoading && (
              <p className="text-sm text-muted-foreground px-2 py-4">
                Loading...
              </p>
            )}
            {!isLoading && candidates.length === 0 && (
              <p className="text-sm text-muted-foreground px-2 py-4">
                No people found.
              </p>
            )}
            {candidates.map((member) => (
              <label
                key={member.userId}
                className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer"
              >
                <Checkbox
                  checked={selectedIds.includes(member.userId)}
                  onCheckedChange={() => toggle(member.userId)}
                />
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
              </label>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!canSubmit || isCreating}
            onClick={handleSubmit}
          >
            {isCreating ? 'Creating...' : 'Create group'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupConversationDialog;
