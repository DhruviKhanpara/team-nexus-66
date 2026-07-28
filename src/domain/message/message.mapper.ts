/**
 * Message domain — DTO → VO mappers.
 *
 * Pure transformations. No API calls, no Redux.
 */

import type {
  MessageAttachmentDTO,
  MessageAttachmentVO,
  MessageDTO,
  MessageListDTO,
  MessageListVO,
  MessageMentionDTO,
  MessageMentionVO,
  MessageReactionDTO,
  MessageReactionVO,
  MessageVO,
} from "@/types/message";

const mapAttachment = (dto: MessageAttachmentDTO): MessageAttachmentVO => ({
  id: dto.id ?? dto._id ?? dto.url,
  url: dto.url,
  originalName: dto.originalName ?? "",
  mimeType: dto.mimeType ?? "",
  sizeInBytes: dto.sizeInBytes ?? 0,
  thumbnailUrl: dto.thumbnailUrl ?? null,
});

const mapMention = (dto: MessageMentionDTO): MessageMentionVO => ({
  id: dto._id,
  name: dto.name ?? "",
  username: dto.username ?? "",
});

const mapReaction = (dto: MessageReactionDTO): MessageReactionVO => ({
  emoji: dto.emoji,
  count: dto.count ?? 0,
  reactedByMe: !!dto.reactedByMe,
  previewNames: dto.previewNames ?? [],
});

export const mapMessageDtoToVO = (dto: MessageDTO): MessageVO => ({
  id: dto.id,
  channelId: dto.channelId ?? null,
  senderId: dto.senderId,
  senderName: dto.senderName ?? "Unknown",
  senderIcon: dto.senderIcon ?? null,
  threadId: dto.threadId ?? null,
  content: dto.content ?? "",
  isSystem: !!dto.isSystem,
  isEdited: !!dto.isEdited,
  editedAt: dto.editedAt ?? null,
  replyCount: dto.replyCount ?? 0,
  lastReplyAt: dto.lastReplyAt ?? null,
  attachments: (dto.attachments ?? []).map(mapAttachment),
  mentions: (dto.mentions ?? []).map(mapMention),
  reactions: (dto.reactions ?? []).map(mapReaction),
  isDeleted: !!dto.isDeleted,
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
});

/**
 * Map the cursor-paginated envelope.
 *
 * Defensive: the backend currently calls its pagination helper positionally,
 * which can yield an envelope with undefined fields — degrade to empty.
 */
export const mapMessageListDtoToVO = (
  dto: MessageListDTO | undefined | null,
): MessageListVO => ({
  data: Array.isArray(dto?.data) ? dto!.data.map(mapMessageDtoToVO) : [],
  hasMore: !!dto?.hasMore,
  nextCursor: dto?.nextCursor ?? null,
});
