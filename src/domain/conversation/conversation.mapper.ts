/**
 * Conversation domain — DTO → VO mappers.
 *
 * Pure transformations. No API calls, no Redux.
 */

import type {
  ConversationDetailDTO,
  ConversationParticipantDTO,
  ConversationParticipantVO,
  ConversationParticipantsListDTO,
  ConversationParticipantsListVO,
  ConversationPeerDTO,
  ConversationPeerVO,
  ConversationSummaryDTO,
  ConversationVO,
  ConversationsListDTO,
  ConversationsListVO,
  DirectLookupDTO,
  DirectLookupVO,
} from "@/types/conversation";

const UNKNOWN_NAME = "Unknown";

/** Initials shown when no avatar image exists. */
const toInitials = (value: string): string =>
  value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "?";

export const mapConversationPeerDtoToVO = (
  dto: ConversationPeerDTO,
): ConversationPeerVO => ({
  userId: dto.userId,
  name: dto.name ?? UNKNOWN_NAME,
  username: dto.username ?? "",
  iconUrl: dto.icon ?? null,
});

export const mapConversationDtoToVO = (
  dto: ConversationSummaryDTO | ConversationDetailDTO,
): ConversationVO => {
  const isDirect = dto.type === "direct";
  const peer = dto.peer ? mapConversationPeerDtoToVO(dto.peer) : null;
  const displayName = isDirect
    ? (peer?.name ?? UNKNOWN_NAME)
    : (dto.name ?? "Group chat");

  return {
    id: dto.id,
    type: dto.type,
    isDirect,
    isGroup: !isDirect,
    displayName,
    initials: toInitials(displayName),
    avatarUrl: isDirect ? (peer?.iconUrl ?? null) : (dto.logo?.url ?? null),
    participantCount: dto.participantCount ?? 0,
    createdAt: dto.createdAt,
    lastMessageAt: dto.lastMessageAt ?? null,
    unreadCount: dto.unreadCount ?? 0,
    mentionCount: dto.mentionCount ?? 0,
    role: dto.role ?? null,
    joinedAt: dto.joinedAt ?? null,
    peer,
    peerUserId: peer?.userId ?? null,
  };
};

export const mapConversationsListDtoToVO = (
  dto: ConversationsListDTO | undefined | null,
): ConversationsListVO => ({
  data: Array.isArray(dto?.data) ? dto!.data.map(mapConversationDtoToVO) : [],
  totalCount: dto?.totalCount ?? 0,
  pageNumber: dto?.pageNumber ?? 1,
  pageSize: dto?.pageSize ?? 0,
  totalPages: dto?.totalPages ?? 0,
  hasNextPage: !!dto?.hasNextPage,
  hasPreviousPage: !!dto?.hasPreviousPage,
});

export const mapConversationParticipantDtoToVO = (
  dto: ConversationParticipantDTO,
): ConversationParticipantVO => ({
  participantId: dto.participantId,
  userId: dto.userId,
  name: dto.name ?? UNKNOWN_NAME,
  username: dto.username ?? "",
  iconUrl: dto.icon ?? null,
  role: dto.role,
  joinedAt: dto.joinedAt,
  rejoinedAt: dto.rejoinedAt ?? null,
});

export const mapConversationParticipantsListDtoToVO = (
  dto: ConversationParticipantsListDTO | undefined | null,
): ConversationParticipantsListVO => ({
  data: Array.isArray(dto?.data)
    ? dto!.data.map(mapConversationParticipantDtoToVO)
    : [],
  totalCount: dto?.totalCount ?? 0,
  pageNumber: dto?.pageNumber ?? 1,
  pageSize: dto?.pageSize ?? 0,
  totalPages: dto?.totalPages ?? 0,
  hasNextPage: !!dto?.hasNextPage,
  hasPreviousPage: !!dto?.hasPreviousPage,
});

export const mapDirectLookupDtoToVO = (
  dto: DirectLookupDTO,
): DirectLookupVO => ({
  conversationId: dto.conversationId ?? null,
  hasExistingConversation: !!dto.hasExistingConversation,
  peer: mapConversationPeerDtoToVO(dto.peer),
});
