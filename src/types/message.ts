/**
 * Message types — DTOs (backend shapes) and VOs (UI shapes).
 *
 * Derived from the backend `toMessageDTO` mapper and the
 * cursor pagination helper (`utils/pagination.util.js`).
 */

//#region DTOs (raw backend shapes)
export interface MessageAttachmentDTO {
  _id?: string;
  id?: string;
  url: string;
  originalName: string;
  mimeType: string;
  fileType?: string;
  sizeInBytes?: number;
  width?: number | null;
  height?: number | null;
  duration?: number | null;
  thumbnailUrl?: string | null;
}

export interface MessageMentionDTO {
  _id: string;
  name?: string;
  username?: string;
}

export interface MessageReactionDTO {
  emoji: string;
  count: number;
  reactedByMe: boolean;
  previewNames?: string[];
}

export interface MessageDTO {
  id: string;
  channelId: string | null;
  conversationId: string | null;
  senderId: string;
  senderName: string | null;
  senderIcon: string | null;
  threadId: string | null;
  content: string | null;
  isSystem: boolean;
  isEdited: boolean;
  editedAt: string | null;
  replyCount: number;
  lastReplyAt: string | null;
  dmStatus: string | null;
  dmDeliveredAt: string | null;
  dmSeenAt: string | null;
  attachments: MessageAttachmentDTO[];
  mentions: MessageMentionDTO[];
  reactions: MessageReactionDTO[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Cursor-paginated envelope returned by GET .../messages */
export interface MessageListDTO {
  data: MessageDTO[];
  hasMore: boolean;
  nextCursor: string | null;
}

export interface GetMessagesQueryDTO {
  pageSize?: number;
  beforeId?: string;
  threadRootMessageId?: string;
}

export interface SendMessageDTO {
  clientMessageId: string;
  content?: string | null;
  fileIds?: string[];
  mentionedUserIds?: string[];
  threadRootMessageId?: string | null;
}
//#endregion

//#region VOs (UI shapes)
export interface MessageAttachmentVO {
  id: string;
  url: string;
  originalName: string;
  mimeType: string;
  sizeInBytes: number;
  thumbnailUrl: string | null;
}

export interface MessageMentionVO {
  id: string;
  name: string;
  username: string;
}

export interface MessageReactionVO {
  emoji: string;
  count: number;
  reactedByMe: boolean;
  previewNames: string[];
}

export interface MessageVO {
  id: string;
  channelId: string | null;
  senderId: string;
  senderName: string;
  senderIcon: string | null;
  threadId: string | null;
  content: string;
  isSystem: boolean;
  isEdited: boolean;
  editedAt: string | null;
  replyCount: number;
  lastReplyAt: string | null;
  attachments: MessageAttachmentVO[];
  mentions: MessageMentionVO[];
  reactions: MessageReactionVO[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MessagePaginationVO {
  hasMore: boolean;
  nextCursor: string | null;
}

export interface MessageListVO extends MessagePaginationVO {
  /** Ordered newest → oldest, exactly as the backend returns it. */
  data: MessageVO[];
}
//#endregion
