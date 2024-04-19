import { zodNotProfaneString } from '@/lib/zod';
import { z } from 'zod';

export const createUpdateReviewSchema = z.object({
  content: zodNotProfaneString(z.string().min(1).max(500)),
  rating: z.number().int().positive().min(1).max(5),
});
