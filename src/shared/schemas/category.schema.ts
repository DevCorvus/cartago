import { z } from 'zod';

export const createUpdateCategorySchema = z.object({
  title: z.string(),
  description: z.string(),
});
