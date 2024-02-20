import { CreateUpdateReviewDto, ReviewDto } from '@/shared/dtos/review.dto';
import { createUpdateReviewSchema } from '@/shared/schemas/review.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';

interface Props {
  review: ReviewDto;
  updateReview(data: ReviewDto): void;
  close(): void;
}

export default function EditReviewForm({ review, updateReview, close }: Props) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateUpdateReviewDto>({
    resolver: zodResolver(createUpdateReviewSchema),
  });

  const onSubmit: SubmitHandler<CreateUpdateReviewDto> = async (data) => {
    const res = await fetch(`/api/reviews/${review.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const data: ReviewDto = await res.json();
      updateReview(data);
      close();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 bg-white p-4 rounded-lg shadow-md border-2 border-gray-50"
    >
      <header className="flex items-center justify-between">
        <h3 className="text-green-800 text-lg font-semibold">Edit review</h3>
        <div className="flex items-center gap-2">
          <label htmlFor="edit-rating" className="text-green-800 opacity-75">
            Rating
          </label>
          <input
            {...register('rating', { valueAsNumber: true })}
            type="number"
            id="edit-rating"
            className="input p-2"
            placeholder="Enter rating"
            min={1}
            max={5}
            defaultValue={review.rating}
          />
          {errors.rating && (
            <p className="text-red-400">{errors.rating.message}</p>
          )}
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
