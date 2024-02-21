import { ReviewDto } from '@/shared/dtos/review.dto';
import { useState } from 'react';
import { HiPencilSquare, HiUserCircle } from 'react-icons/hi2';
import EditReviewForm from './EditReviewForm';

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
    <div className="flex gap-1.5 bg-white p-3 rounded-md shadow-md border-2 border-gray-50">
      <HiUserCircle className="-mt-0.5 text-green-800 text-3xl" />
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-green-800 font-semibold">
              {review.user.fullname}
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
          {review.isOwner && (
            <button
              onClick={() => setEditMode(true)}
              title="Edit review"
              className="text-lg hover:text-green-800 focus:text-green-800 transition"
            >
              <HiPencilSquare />
            </button>
          )}
        </div>
        <p className="whitespace-pre-line">{review.content}</p>
      </div>
    </div>
  );
}
