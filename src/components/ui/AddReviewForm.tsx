import { CreateUpdateReviewDto, ReviewDto } from '@/shared/dtos/review.dto';
import { createUpdateReviewSchema } from '@/shared/schemas/review.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { HiMiniPlus } from 'react-icons/hi2';
import RatingInput from './RatingInput';
import { useCreateReview } from '@/data/review';
import { toastError } from '@/lib/toast';

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
  } = useForm<CreateUpdateReviewDto>({
    resolver: zodResolver(createUpdateReviewSchema),
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

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-transparent border-t-gray-100 bg-white p-3 font-semibold text-green-800 shadow-md transition hover:border-green-700 focus:border-green-700"
      >
        <HiMiniPlus className="text-3xl" />
        Write review
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 rounded-lg border-2 border-gray-50 bg-white p-4 shadow-md"
    >
      <header className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-green-800">New review</h3>
        <div className="flex items-center gap-2">
          <label htmlFor="rating" className="text-green-800 opacity-75">
            Rating
          </label>
          <RatingInput handler={handleRating} error={Boolean(errors.rating)} />
        </div>
      </header>
      <div className="flex flex-col gap-1">
        <label hidden htmlFor="content" className="text-green-800 opacity-75">
          Content
        </label>
        <textarea
          {...register('content')}
          id="content"
          className="textarea p-3"
          placeholder="Enter content"
          autoFocus
        ></textarea>
        {errors.content && (
          <p className="text-red-400">{errors.content.message}</p>
        )}
      </div>
      <div className="flex gap-2">
        <button type="submit" className="btn px-5 py-2">
          Send
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
