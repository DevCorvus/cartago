import { CreateUpdateReviewDto, ReviewDto } from '@/shared/dtos/review.dto';
import { createUpdateReviewSchema } from '@/shared/schemas/review.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { HiMiniPlus } from 'react-icons/hi2';
import RatingInput from './RatingInput';
import { useCreateReview } from '@/data/review';
import { toastError } from '@/lib/toast';
import { ImSpinner8 } from 'react-icons/im';

interface Props {
  productId: string;
  addReview(data: ReviewDto): void;
}

export default function AddReviewForm({ productId, addReview }: Props) {
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<CreateUpdateReviewDto>({
    resolver: zodResolver(createUpdateReviewSchema),
    defaultValues: {
      content: '',
    },
  });

  const createReviewMutation = useCreateReview();

  const onSubmit: SubmitHandler<CreateUpdateReviewDto> = async (data) => {
    try {
      const newReview = await createReviewMutation.mutateAsync({
        productId,
        data,
      });
      addReview(newReview);
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

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-neutral-100 bg-white p-3 font-semibold text-cyan-600 shadow-sm transition hover:text-cyan-500 hover:shadow-md focus:text-cyan-500 focus:shadow-md"
      >
        <HiMiniPlus className="text-3xl" />
        Write review
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-lg border-2 border-neutral-100 bg-white p-4 shadow-md"
    >
      <header className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-cyan-700">New review</h3>
        <div className="flex items-center gap-2">
          <label htmlFor="rating" className="text-slate-400">
            Rating
          </label>
          <RatingInput handler={handleRating} error={Boolean(errors.rating)} />
        </div>
      </header>
      <div className="space-y-1">
        <label hidden htmlFor="content">
          Content
        </label>
        <div>
          <textarea
            {...register('content')}
            id="content"
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
        <button
          disabled={createReviewMutation.isPending}
          type="submit"
          className={`${createReviewMutation.isPending ? 'btn-disabled' : 'btn'} flex items-center gap-1 px-5 py-2`}
        >
          {createReviewMutation.isPending && (
            <ImSpinner8 className="animate-spin" />
          )}
          {createReviewMutation.isPending ? 'Sending' : 'Send'}
        </button>
        <button
          type="button"
          className="btn-alternative px-3 py-2"
          onClick={() => setShowForm(false)}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
