'use client';

import { ReviewDto } from '@/shared/dtos/review.dto';
import { useCallback, useEffect, useState } from 'react';
import Loading from './Loading';
import AddReviewForm from './AddReviewForm';
import ProductReviewItem from './ProductReviewItem';
import { useReviews } from '@/data/review';
import SomethingWentWrong from './SomethingWentWrong';

interface Props {
  productId: string;
}

export default function ProductReviewList({ productId }: Props) {
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [canReview, setCanReview] = useState(false);

  const { isLoading, isError, data } = useReviews(productId);

  useEffect(() => {
    if (data) {
      setReviews(data.reviews);
      setCanReview(data.canReview);
    }
  }, [data]);

  const addReview = useCallback((newReview: ReviewDto) => {
    setReviews((prev) => [newReview, ...prev]);
    setCanReview(false);
  }, []);

  const updateReview = useCallback((updatedReview: ReviewDto) => {
    setReviews((prev) =>
      prev.map((review) => {
        if (review.id !== updatedReview.id) return review;
        else return updatedReview;
      }),
    );
  }, []);

  if (isLoading) return <Loading />;
  if (isError) return <SomethingWentWrong />;

  return (
    <section className="w-full space-y-6">
      <header>
        <h2 className="text-xl font-bold leading-loose text-slate-400/50">
          Reviews ({reviews.length})
        </h2>
      </header>
      {canReview && (
        <AddReviewForm productId={productId} addReview={addReview} />
      )}
      <ul className="space-y-3">
        {reviews.map((review, i) => (
          <li key={i}>
            <ProductReviewItem review={review} updateReview={updateReview} />
          </li>
        ))}
      </ul>
    </section>
  );
}
