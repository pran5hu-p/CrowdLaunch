import * as z from "zod";

export const formSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters long"),
  slug: z.string()
    .min(2, "Slug must be at least 2 characters long")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly (lowercase letters, numbers, and hyphens only)"),
  tagline: z.string()
    .min(5, "Tagline is required and must be at least 5 characters long")
    .max(100, "Tagline must be less than 100 characters long"),
  description: z.string()
    .min(10, "Description must be at least 10 characters long")
    .max(1000, "Description must be less than 1000 characters long"),
  websiteUrl: z.string().url("Must be a valid URL"),
  tags: z.string().min(1, "At least one tag is required"),
});

export type ProductFormValues = z.infer<typeof formSchema>;