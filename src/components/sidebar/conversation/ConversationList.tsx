import ConversationItem from './ConversationItem';
import type { ConversationVO } from '@/types/conversation';

interface ConversationListProps {
  conversations: ConversationVO[];
  activeConversationId: string | null;
  onSelect: (conversationId: string) => void;
}

/** Data-agnostic list of conversation rows. */
const ConversationList = ({
  conversations,
  activeConversationId,
  onSelect,
}: ConversationListProps) => (
  <div className="space-y-0.5">
    {conversations.map((conversation) => (
      <ConversationItem
        key={conversation.id}
        conversation={conversation}
        isActive={conversation.id === activeConversationId}
        onSelect={onSelect}
      />
    ))}
  </div>
);

export default ConversationList;
