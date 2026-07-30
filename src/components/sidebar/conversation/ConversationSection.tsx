import { useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setActiveChatContext } from '@/features/uiSlice';
import { setSelectedConversationId } from '@/features/conversationSlice';
import {
  selectActiveChatContext,
  selectConversations,
  selectConversationsLoading,
  selectSearchQuery,
} from '@/features/selectors';
import { SidebarEmptyState, SidebarSection } from '@/components/sidebar/primitives';
import ConversationList from './ConversationList';
import NewConversationButton from './NewConversationButton';
import CreateDirectConversationDialog from '@/components/conversation/CreateDirectConversationDialog';
import CreateGroupConversationDialog from '@/components/conversation/CreateGroupConversationDialog';

/**
 * Container for the current user's conversations.
 * Data is hydrated in AppLayout; this component only reads from Redux.
 */
const ConversationSection = () => {
  const dispatch = useAppDispatch();
  const conversations = useAppSelector(selectConversations);
  const isLoading = useAppSelector(selectConversationsLoading);
  const searchQuery = useAppSelector(selectSearchQuery);
  const activeChatContext = useAppSelector(selectActiveChatContext);

  const [directOpen, setDirectOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);

  const visible = useMemo(() => {
    const sorted = [...conversations].sort((a, b) => {
      const aTime = a.lastMessageAt ?? a.createdAt;
      const bTime = b.lastMessageAt ?? b.createdAt;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });
    if (!searchQuery) return sorted;
    return sorted.filter((c) =>
      c.displayName.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [conversations, searchQuery]);

  const activeConversationId =
    activeChatContext?.type === 'conversation' ? activeChatContext.id : null;

  const handleSelect = (conversationId: string) => {
    dispatch(setSelectedConversationId(conversationId));
    dispatch(setActiveChatContext({ type: 'conversation', id: conversationId }));
  };

  return (
    <>
      <SidebarSection
        label="Conversations"
        action={
          <NewConversationButton
            onNewDirect={() => setDirectOpen(true)}
            onNewGroup={() => setGroupOpen(true)}
          />
        }
      >
        {visible.length === 0 ? (
          <SidebarEmptyState
            message={isLoading ? 'Loading conversations...' : 'No conversations yet.'}
          />
        ) : (
          <ConversationList
            conversations={visible}
            activeConversationId={activeConversationId}
            onSelect={handleSelect}
          />
        )}
      </SidebarSection>

      <CreateDirectConversationDialog
        open={directOpen}
        onOpenChange={setDirectOpen}
      />
      <CreateGroupConversationDialog open={groupOpen} onOpenChange={setGroupOpen} />
    </>
  );
};

export default ConversationSection;
