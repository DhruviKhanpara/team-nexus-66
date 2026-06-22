import { z } from "zod";

const getTeamsQuerySchema = z.object({
  search: z.string().trim().optional(),
  isArchived: z.boolean().optional(),
  includePrivate: z.boolean().optional(),
  pageNumber: z.number().int().min(1).optional(),
  pageSize: z.number().int().min(1).max(100).optional(),
});

type GetTeamsQueryFormData = z.infer<typeof getTeamsQuerySchema>;

export { getTeamsQuerySchema };
export type { GetTeamsQueryFormData };
