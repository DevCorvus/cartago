'use client';

import { ReviewDto } from '@/shared/dtos/review.dto';
import { useCallback, useEffect, useState } from 'react';
import Loading from './Loading';
import AddReviewForm from './AddReviewForm';
import ProductReviewItem from './ProductReviewItem';

interface Props {
  productId: string;
}

export default function ProductReviewList({ productId }: Props) {
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/products/${productId}/reviews`);

      if (res.ok) {
        const data: ReviewDto[] = await res.json();
        setReviews(data);
      }

      setLoading(false);
    })();
  }, [productId]);

  const addReview = useCallback((newReview: ReviewDto) => {
    setReviews((prev) => [newReview, ...prev]);
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

  return (
    <section className="mt-10 w-full flex flex-col gap-6">
      <header>
        <h2 className="text-green-800 text-xl font-bold">
          Reviews ({reviews.length})
        </h2>
      </header>
      <AddReviewForm productId={productId} addReview={addReview} />
      <ul className="flex flex-col gap-2">
        {reviews.map((review, i) => (
          <li key={i}>
            <ProductReviewItem review={review} updateReview={updateReview} />
          </li>
        ))}
      </ul>
    </section>
  );
}
