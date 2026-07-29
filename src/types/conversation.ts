/**
 * Conversation types — DTOs (server response shapes) and VOs (UI-facing).
 *
 * Endpoints in scope (mounted at /conversations):
 *  - GET    /conversations                                   → paginated ConversationSummaryDTO
 *  - GET    /conversations/direct?userId=                    → DirectLookupDTO
 *  - GET    /conversations/:id                               → ConversationDetailDTO
 *  - GET    /conversations/:id/participants                  → paginated ConversationParticipantDTO
 *  - POST   /conversations/direct                            → ConversationDetailDTO
 *  - POST   /conversations/group                             → ConversationDetailDTO
 *  - PUT    /conversations/:id                               → null
 *  - POST   /conversations/:id/participants                  → null
 *  - PUT    /conversations/:id/participants/:pid/role        → null
 *  - DELETE /conversations/:id/participants/me               → null
 *  - DELETE /conversations/:id/participants/:pid             → null
 */

import type { PaginatedDTO, PaginatedVO } from "./team";

export type ConversationTypeValue = "direct" | "group";

//#region Data Transfer Objects
export interface ConversationLogoDTO {
  url: string | null;
  publicId?: string | null;
}

export interface ConversationPeerDTO {
  userId: string;
  name: string | null;
  username: string | null;
  icon: string | null;
}

export interface ConversationSummaryDTO {
  id: string;
  type: ConversationTypeValue;
  name: string | null;
  logo: ConversationLogoDTO | null;
  participantCount: number;
  createdAt: string;
  lastMessageAt: string | null;
  unreadCount: number;
  mentionCount: number;
  role: string | null;
  joinedAt: string | null;
  peer: ConversationPeerDTO | null;
}

export type ConversationDetailDTO = ConversationSummaryDTO;

export type ConversationsListDTO = PaginatedDTO<ConversationSummaryDTO>;

export interface ConversationParticipantDTO {
  participantId: string;
  userId: string;
  name: string | null;
  username: string | null;
  icon: string | null;
  role: string;
  joinedAt: string;
  rejoinedAt: string | null;
}

export type ConversationParticipantsListDTO =
  PaginatedDTO<ConversationParticipantDTO>;

export interface DirectLookupDTO {
  conversationId: string | null;
  hasExistingConversation: boolean;
  peer: ConversationPeerDTO;
}

export interface GetConversationsQueryDTO {
  pageNumber?: number;
  pageSize?: number;
}

export interface CreateDirectConversationDTO {
  targetUserId: string;
}

export interface CreateGroupConversationDTO {
  name: string;
  participantUserIds: string[];
}

export interface UpdateGroupConversationDTO {
  name: string;
}

export interface AddParticipantDTO {
  userId: string;
}

export interface UpdateParticipantRoleDTO {
  role: string;
}
//#endregion

//#region Value Objects
export interface ConversationPeerVO {
  userId: string;
  name: string;
  username: string;
  iconUrl: string | null;
}

export interface ConversationVO {
  id: string;
  type: ConversationTypeValue;
  isDirect: boolean;
  isGroup: boolean;
  /** Group name, or the peer's name for direct conversations. */
  displayName: string;
  initials: string;
  avatarUrl: string | null;
  participantCount: number;
  createdAt: string;
  lastMessageAt: string | null;
  unreadCount: number;
  mentionCount: number;
  role: string | null;
  joinedAt: string | null;
  peer: ConversationPeerVO | null;
  peerUserId: string | null;
}

export interface ConversationParticipantVO {
  participantId: string;
  userId: string;
  name: string;
  username: string;
  iconUrl: string | null;
  role: string;
  joinedAt: string;
  rejoinedAt: string | null;
}

export interface DirectLookupVO {
  conversationId: string | null;
  hasExistingConversation: boolean;
  peer: ConversationPeerVO;
}

export type ConversationsListVO = PaginatedVO<ConversationVO>;
export type ConversationParticipantsListVO =
  PaginatedVO<ConversationParticipantVO>;

export interface GetConversationsQueryVO {
  pageNumber?: number;
  pageSize?: number;
}
//#endregion
