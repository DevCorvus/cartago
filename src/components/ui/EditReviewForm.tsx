import { CreateUpdateReviewDto, ReviewDto } from '@/shared/dtos/review.dto';
import { createUpdateReviewSchema } from '@/shared/schemas/review.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import RatingInput from './RatingInput';
import { useUpdateReview } from '@/data/review';
import { toastError } from '@/lib/toast';

interface Props {
  review: ReviewDto;
  updateReview(data: ReviewDto): void;
  close(): void;
}

export default function EditReviewForm({ review, updateReview, close }: Props) {
  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateUpdateReviewDto>({
    resolver: zodResolver(createUpdateReviewSchema),
  });

  const updateReviewMutation = useUpdateReview();

  const onSubmit: SubmitHandler<CreateUpdateReviewDto> = async (data) => {
    try {
      const updatedReview = await updateReviewMutation.mutateAsync({
        reviewId: review.id,
        data,
      });
      updateReview(updatedReview);
      close();
    } catch (err) {
      toastError(err);
    }
  };

  const handleRating = useCallback(
    (score: number) => {
      setValue('rating', score);
    },
    [setValue],
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 rounded-lg border-2 border-gray-50 bg-white p-4 shadow-md"
    >
      <header className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-green-800">Edit review</h3>
        <div className="flex items-center gap-2">
          <label htmlFor="edit-rating" className="text-green-800 opacity-75">
            Rating
          </label>
          <RatingInput
            defaultValue={review.rating}
            handler={handleRating}
            error={Boolean(errors.rating)}
          />
        </div>
      </header>
      <div className="flex flex-col gap-1">
        <label
          hidden
          htmlFor="edit-content"
          className="text-green-800 opacity-75"
        >
          Content
        </label>
        <textarea
          {...register('content')}
          id="edit-content"
          className="textarea p-3"
          placeholder="Enter content"
          defaultValue={review.content}
          autoFocus
        ></textarea>
        {errors.content && (
          <p className="text-red-400">{errors.content.message}</p>
        )}
      </div>
      <div className="flex gap-2">
        <button type="submit" className="btn px-5 py-2">
          Apply
        </button>
        <button
          type="button"
          className="btn-alternative px-3 py-2"
          onClick={close}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
