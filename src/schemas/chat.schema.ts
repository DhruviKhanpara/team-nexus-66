/**
 * Chat validation schemas (Zod).
 */

import { z } from 'zod';

export const MAX_MESSAGE_LENGTH = 4000;

export const messageSchema = z.object({
  content: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(MAX_MESSAGE_LENGTH, `Message must be under ${MAX_MESSAGE_LENGTH} characters`),
});

export type MessageFormData = z.infer<typeof messageSchema>;
