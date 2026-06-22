import { z } from "zod";

const orgSlugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const createOrganizationSchema = z.object({
  name: z
    .string({ required_error: "Organization name is required." })
    .min(1, "Organization name cannot be empty.")
    .max(100, "Organization name cannot exceed 100 characters.")
    .trim(),

  slug: z
    .string({ required_error: "Organization slug is required." })
    .min(2, "Slug must be at least 2 characters.")
    .max(48, "Slug cannot exceed 48 characters.")
    .refine((val) => !val.startsWith("-") && !val.endsWith("-"), {
      message: "Slug cannot start or end with a hyphen.",
    })
    .regex(
      orgSlugRegex,
      "Slug can only contain lowercase letters, numbers, and hyphens.",
    ),
});

type CreateOrganizationFormData = z.infer<typeof createOrganizationSchema>;

export { createOrganizationSchema };
export type { CreateOrganizationFormData };
