/**
 * Conversation validation schemas (Zod) — mirrors the backend
 * conversation validators.
 */

import { z } from "zod";

export const MAX_GROUP_NAME_LENGTH = 150;
export const MIN_GROUP_PARTICIPANTS = 2;

export const createDirectConversationSchema = z.object({
  targetUserId: z.string().min(1, "Select a person to message."),
});

export const createGroupConversationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Group name cannot be empty.")
    .max(
      MAX_GROUP_NAME_LENGTH,
      `Group name cannot exceed ${MAX_GROUP_NAME_LENGTH} characters.`,
    ),
  participantUserIds: z
    .array(z.string().min(1))
    .min(
      MIN_GROUP_PARTICIPANTS,
      `A group conversation requires at least ${MIN_GROUP_PARTICIPANTS} other participants.`,
    ),
});

export const updateGroupConversationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Group name cannot be empty.")
    .max(
      MAX_GROUP_NAME_LENGTH,
      `Group name cannot exceed ${MAX_GROUP_NAME_LENGTH} characters.`,
    ),
});

export const addParticipantSchema = z.object({
  userId: z.string().min(1, "User ID is required."),
});

export const updateParticipantRoleSchema = z.object({
  role: z.enum(["GroupAdmin", "GroupMember"]),
});

export type CreateDirectConversationFormData = z.infer<
  typeof createDirectConversationSchema
>;
export type CreateGroupConversationFormData = z.infer<
  typeof createGroupConversationSchema
>;
export type UpdateGroupConversationFormData = z.infer<
  typeof updateGroupConversationSchema
>;
