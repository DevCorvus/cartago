import { SubmitHandler, useForm } from 'react-hook-form';
import {
  CategoryDto,
  CreateUpdateCategoryDto,
} from '@/shared/dtos/category.dto';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUpdateCategorySchema } from '@/shared/schemas/category.schema';
import { useState } from 'react';
import { HiMiniPlus } from 'react-icons/hi2';
import { useCreateCategory } from '@/data/category';
import { toastError } from '@/lib/toast';

interface Props {
  addCategory(data: CategoryDto): void;
}

export default function AddCategoryForm({ addCategory }: Props) {
  const [showForm, setShowForm] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateUpdateCategoryDto>({
    resolver: zodResolver(createUpdateCategorySchema),
  });

  const createCategoryMutation = useCreateCategory();

  const onSubmit: SubmitHandler<CreateUpdateCategoryDto> = async (data) => {
    try {
      const newCategory = await createCategoryMutation.mutateAsync(data);
      addCategory(newCategory);
      setShowForm(false);
    } catch (err) {
      toastError(err);
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-transparent border-t-gray-100 bg-white p-3 font-semibold text-green-800 shadow-md transition hover:border-green-700 focus:border-green-700"
      >
        <HiMiniPlus className="text-3xl" />
        Add category
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 rounded-md border-2 border-gray-50 bg-white p-6 shadow-md"
    >
      <header>
        <h1 className="text-xl font-bold text-green-800">New category</h1>
      </header>
      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="text-green-800 opacity-75">
          Title
        </label>
        <input
          {...register('title')}
          type="text"
          id="title"
          placeholder="Enter category title"
          className="input p-3"
        />
        {errors.title && <p className="text-red-400">{errors.title.message}</p>}
        {createCategoryMutation.isError && (
          <p className="text-red-400">Already taken</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="text-green-800 opacity-75">
          Description (optional)
        </label>
        <textarea
          {...register('description')}
          id="description"
          className="textarea p-3"
          placeholder="Enter category description"
        ></textarea>
        {errors.description && (
          <p className="text-red-400">{errors.description.message}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button type="submit" className="btn px-5 py-2">
          Create
        </button>
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="btn-alternative px-5 py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
