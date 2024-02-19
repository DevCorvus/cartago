import { z } from 'zod';
import { createReviewSchema } from '../schemas/review.schema';

export type CreateReviewDto = z.infer<typeof createReviewSchema>;

export interface ReviewDto {
  content: string;
  rating: number;
  edited: boolean;
  createdAt: Date;
  updatedAt: Date;
}
