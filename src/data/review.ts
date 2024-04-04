import {
  CreateUpdateReviewDto,
  ReviewDto,
  ReviewListDto,
} from '@/shared/dtos/review.dto';
import { useMutation, useQuery } from '@tanstack/react-query';

interface CreateReviewInterface {
  productId: string;
  data: CreateUpdateReviewDto;
}

export const useReviews = (productId: string) => {
  return useQuery<ReviewListDto>({
    queryFn: async () => {
      const res = await fetch(`/api/products/${productId}/reviews`);

      if (!res.ok) {
        throw new Error('Could not get reviews');
      }

      return res.json();
    },
    queryKey: ['reviews'],
  });
};

export const useCreateReview = () => {
  return useMutation({
    mutationFn: async ({
      productId,
      data,
    }: CreateReviewInterface): Promise<ReviewDto> => {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Could not create review');
      }

      return res.json();
    },
    mutationKey: ['createReview'],
  });
};

interface UpdateReviewInterface {
  reviewId: string;
  data: CreateUpdateReviewDto;
}

export const useUpdateReview = () => {
  return useMutation({
    mutationFn: async ({
      reviewId,
      data,
    }: UpdateReviewInterface): Promise<ReviewDto> => {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Could not update review');
      }

      return res.json();
    },
  });
};
