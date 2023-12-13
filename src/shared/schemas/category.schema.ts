import { z } from 'zod';

export const createUpdateCategorySchema = z.object({
  title: z.string().min(2).max(30).trim().toLowerCase(),
  description: z.string().max(200).trim(),
});
