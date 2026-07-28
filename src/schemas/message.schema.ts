/**
 * Message validation schemas (Zod) — mirrors the backend
 * `sendChannelMessageSchema` validator.
 */

import { z } from "zod";

export const MAX_MESSAGE_LENGTH = 10000;

export const sendMessageSchema = z
  .object({
    content: z
      .string()
      .trim()
      .max(
        MAX_MESSAGE_LENGTH,
        `Content cannot exceed ${MAX_MESSAGE_LENGTH} characters.`,
      )
      .optional(),
    fileIds: z.array(z.string()).default([]),
    mentionedUserIds: z.array(z.string()).default([]),
    threadRootMessageId: z.string().nullable().optional(),
  })
  .refine(
    (data) => (data.content?.trim().length ?? 0) > 0 || data.fileIds.length > 0,
    {
      message: "Message must contain text or at least one attachment.",
      path: ["content"],
    },
  );

export type SendMessageFormData = z.infer<typeof sendMessageSchema>;
