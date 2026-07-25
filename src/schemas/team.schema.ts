import { z } from "zod";

const getTeamsQuerySchema = z.object({
  search: z.string().trim().optional(),
  isArchived: z.boolean().optional(),
  includePrivate: z.boolean().optional(),
  pageNumber: z.number().int().min(1).optional(),
  pageSize: z.number().int().min(1).max(100).optional(),
});

const createTeamSchema = z.object({
  name: z
    .string({ required_error: "Team name is required." })
    .trim()
    .min(1, "Team name cannot be empty.")
    .max(100, "Team name cannot exceed 100 characters."),

  description: z
    .string()
    .trim()
    .max(1024, "Description cannot exceed 1024 characters.")
    .optional(),

  isPrivate: z.boolean().default(false),
});

const updateTeamSchema = z.object({
  name: z
    .string({ required_error: "Team name is required." })
    .trim()
    .min(1, "Team name cannot be empty.")
    .max(100, "Team name cannot exceed 100 characters."),

  description: z
    .string()
    .trim()
    .max(1024, "Description cannot exceed 1024 characters.")
    .optional(),
});

type GetTeamsQueryFormData = z.infer<typeof getTeamsQuerySchema>;
type CreateTeamFormData = z.infer<typeof createTeamSchema>;
type UpdateTeamFormData = z.infer<typeof updateTeamSchema>;

export { getTeamsQuerySchema, createTeamSchema, updateTeamSchema };
export type { GetTeamsQueryFormData, CreateTeamFormData, UpdateTeamFormData };
