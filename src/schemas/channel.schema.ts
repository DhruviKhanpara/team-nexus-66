import { z } from "zod";

const getChannelsQuerySchema = z.object({
  search: z.string().trim().optional(),
  isArchived: z.boolean().optional(),
  includePrivate: z.boolean().optional(),
  pageNumber: z.number().int().min(1).optional(),
  pageSize: z.number().int().min(1).max(100).optional(),
});

const createChannelSchema = z.object({
  name: z
    .string({ required_error: "Channel name is required." })
    .trim()
    .min(1, "Channel name cannot be empty.")
    .max(100, "Channel name cannot exceed 100 characters."),

  description: z
    .string()
    .trim()
    .max(1024, "Description cannot exceed 1024 characters.")
    .optional(),

  type: z.enum(["text", "announcement"]).default("text"),

  isPrivate: z.boolean().default(false),
});

const updateChannelSchema = z.object({
  name: z
    .string({ required_error: "Channel name is required." })
    .trim()
    .min(1, "Channel name cannot be empty.")
    .max(100, "Channel name cannot exceed 100 characters."),

  description: z
    .string()
    .trim()
    .max(1024, "Description cannot exceed 1024 characters.")
    .optional(),
});

type GetChannelsQueryFormData = z.infer<typeof getChannelsQuerySchema>;
type CreateChannelFormData = z.infer<typeof createChannelSchema>;
type UpdateChannelFormData = z.infer<typeof updateChannelSchema>;

export { getChannelsQuerySchema, createChannelSchema, updateChannelSchema };
export type {
  GetChannelsQueryFormData,
  CreateChannelFormData,
  UpdateChannelFormData,
};
