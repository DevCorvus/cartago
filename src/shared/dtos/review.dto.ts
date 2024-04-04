import { z } from 'zod';
import { createUpdateReviewSchema } from '../schemas/review.schema';

export type CreateUpdateReviewDto = z.infer<typeof createUpdateReviewSchema>;

export interface ReviewDto {
  id: string;
  content: string;
  rating: number;
  edited: boolean;
  createdAt: Date;
  updatedAt: Date;
  isOwner: boolean;
  user: {
    fullname: string;
  };
}

export interface ReviewListDto {
  canReview: boolean;
  reviews: ReviewDto[];
}
