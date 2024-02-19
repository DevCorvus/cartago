'use client';

import { ReviewDto } from '@/shared/dtos/review.dto';
import { useCallback, useEffect, useState } from 'react';
import Loading from './Loading';
import AddReviewForm from './AddReviewForm';
import { HiUserCircle } from 'react-icons/hi2';

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
            <div className="flex gap-1.5 bg-white p-3 rounded-md shadow-md border-2 border-gray-50">
              <HiUserCircle className="-mt-0.5 text-green-800 text-3xl" />
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-green-800 font-semibold">
                    Anonymous
                  </span>
                  {review.edited && (
                    <span
                      title={new Date(review.updatedAt).toDateString()}
                      className="text-slate-400 text-sm italic"
                    >
                      edited
                    </span>
                  )}
                </div>
                <p>{review.content}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
