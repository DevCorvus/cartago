import { z } from 'zod';

export const createUpdateReviewSchema = z.object({
  content: z.string().nonempty().max(500),
  rating: z.number().int().positive().min(1).max(5),
});
