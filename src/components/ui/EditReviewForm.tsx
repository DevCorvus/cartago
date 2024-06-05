import { CreateUpdateReviewDto, ReviewDto } from '@/shared/dtos/review.dto';
import { createUpdateReviewSchema } from '@/shared/schemas/review.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import RatingInput from './RatingInput';
import { useUpdateReview } from '@/data/review';
import { toastError } from '@/lib/toast';
import SubmitButton from './SubmitButton';

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
    watch,
  } = useForm<CreateUpdateReviewDto>({
    resolver: zodResolver(createUpdateReviewSchema),
    defaultValues: {
      content: review.content,
    },
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

  const content = watch('content');

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-lg border-2 border-neutral-100 bg-white p-4 shadow-md"
    >
      <header className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-cyan-700">Edit review</h3>
        <div className="flex items-center gap-2">
          <label htmlFor="edit-rating" className="text-slate-400">
            Rating
          </label>
          <RatingInput
            defaultValue={review.rating}
            handler={handleRating}
            error={Boolean(errors.rating)}
          />
        </div>
      </header>
      <div className="space-y-1">
        <label hidden htmlFor="edit-content">
          Content
        </label>
        <div>
          <textarea
            {...register('content')}
            id="edit-content"
            className="textarea p-3"
            placeholder="Enter content"
            autoFocus
          />
          <span className="block text-right text-xs text-slate-500/50">
            ({content.length}/500)
          </span>
        </div>
        {errors.content && (
          <p className="text-red-400">{errors.content.message}</p>
        )}
      </div>
      <div className="flex gap-2">
        <SubmitButton
          className="px-5 py-2"
          disabled={updateReviewMutation.isPending}
          placeholder="Applying"
        >
          Apply
        </SubmitButton>
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
