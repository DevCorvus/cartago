import { ReviewDto } from '@/shared/dtos/review.dto';
import { useState } from 'react';
import { HiPencilSquare, HiUserCircle } from 'react-icons/hi2';
import EditReviewForm from './EditReviewForm';
import Rating from './Rating';

interface Props {
  review: ReviewDto;
  updateReview(data: ReviewDto): void;
}

export default function ProductReviewItem({ review, updateReview }: Props) {
  const [editMode, setEditMode] = useState(false);

  if (editMode) {
    return (
      <EditReviewForm
        review={review}
        updateReview={updateReview}
        close={() => setEditMode(false)}
      />
    );
  }

  return (
    <div className="flex gap-1.5 rounded-md border-2 border-gray-50 bg-white p-3 shadow-md">
      <HiUserCircle className="-mt-0.5 text-3xl text-green-800" />
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-green-800">
              {review.user.fullname}
            </span>
            {review.edited && (
              <span
                title={new Date(review.updatedAt).toDateString()}
                className="text-sm italic text-slate-400"
              >
                edited
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <Rating score={review.rating} />
            {review.isOwner && (
              <button
                onClick={() => setEditMode(true)}
                title="Edit review"
                className="text-lg transition hover:text-green-800 focus:text-green-800"
              >
                <HiPencilSquare />
              </button>
            )}
          </div>
        </div>
        <p className="whitespace-pre-line">{review.content}</p>
      </div>
    </div>
  );
}
