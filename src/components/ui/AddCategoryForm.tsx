'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import {
  CategoryDto,
  CreateUpdateCategoryDto,
} from '@/shared/dtos/category.dto';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUpdateCategorySchema } from '@/shared/schemas/category.schema';
import { useCreateCategory } from '@/data/category';
import { toastError } from '@/lib/toast';
import Modal from './Modal';
import { useClickOutside } from '@/hooks/useClickOutside';
import { ImSpinner8 } from 'react-icons/im';

interface Props {
  addCategory(data: CategoryDto): void;
  close(): void;
}

export default function AddCategoryForm({ addCategory, close }: Props) {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<CreateUpdateCategoryDto>({
    resolver: zodResolver(createUpdateCategorySchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const createCategoryMutation = useCreateCategory();

  const onSubmit: SubmitHandler<CreateUpdateCategoryDto> = async (data) => {
    try {
      const newCategory = await createCategoryMutation.mutateAsync(data);
      addCategory(newCategory);
      close();
    } catch (err) {
      toastError(err);
    }
  };

  const description = watch('description');

  const ref = useClickOutside<HTMLFormElement>(close);

  return (
    <Modal>
      <form
        ref={ref}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 rounded-lg border-2 border-neutral-100 bg-white p-6 shadow-md"
      >
        <header>
          <span className="text-lg font-semibold text-cyan-700">
            New category
          </span>
        </header>
        <div className="space-y-1">
          <label htmlFor="title" className="text-slate-500">
            Title
          </label>
          <input
            {...register('title')}
            type="text"
            id="title"
            placeholder="Enter category title"
            className="input p-3"
          />
          {errors.title && (
            <p className="text-red-400">{errors.title.message}</p>
          )}
          {createCategoryMutation.isError && (
            <p className="text-red-400">Already taken</p>
          )}
        </div>
        <div className="space-y-1">
          <label htmlFor="description" className="text-slate-500">
            Description (optional)
          </label>
          <div>
            <textarea
              {...register('description')}
              id="description"
              className="textarea p-3"
              placeholder="Enter category description"
            />
            <span className="block text-right text-xs text-slate-500/50">
              ({description.length}/200)
            </span>
          </div>
          {errors.description && (
            <p className="text-red-400">{errors.description.message}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled={isSubmitting}
            type="submit"
            className="btn flex items-center gap-1 px-5 py-2"
          >
            {isSubmitting && <ImSpinner8 className="animate-spin" />}
            {isSubmitting ? 'Creating' : 'Create'}
          </button>
          <button
            type="button"
            onClick={close}
            className="btn-alternative px-3 py-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
