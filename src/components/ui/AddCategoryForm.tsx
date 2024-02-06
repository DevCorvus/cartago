import { SubmitHandler, useForm } from 'react-hook-form';
import {
  CategoryDto,
  CreateUpdateCategoryDto,
} from '@/shared/dtos/category.dto';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUpdateCategorySchema } from '@/shared/schemas/category.schema';
import { useState } from 'react';
import { HiMiniPlus } from 'react-icons/hi2';

interface Props {
  addCategory(data: CategoryDto): void;
}

export default function AddCategoryForm({ addCategory }: Props) {
  const [alreadyExistsError, setAlreadyExistsError] = useState<boolean>(false);
  const [showForm, setShowForm] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateUpdateCategoryDto>({
    resolver: zodResolver(createUpdateCategorySchema),
  });

  const onSubmit: SubmitHandler<CreateUpdateCategoryDto> = async (data) => {
    setAlreadyExistsError(false);

    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const data: CategoryDto = await res.json();
      addCategory(data);
      setShowForm(false);
    } else {
      setAlreadyExistsError(true);
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full p-2 rounded-full shadow-md bg-lime-50 border border-green-700 text-green-800 font-semibold flex items-center justify-center gap-2"
      >
        <HiMiniPlus className="text-3xl" />
        Add new category
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-lime-50 rounded-md shadow-md p-8 flex flex-col gap-3 text-green-800"
    >
      <header className="mb-3">
        <h1 className="text-2xl font-bold">Add category</h1>
      </header>
      <div className="flex flex-col gap-2">
        <label htmlFor="category-title">Title</label>
        <input
          {...register('title')}
          type="text"
          id="category-title"
          placeholder="Enter category title"
          className="p-3 rounded-md shadow-md outline-none"
        />
        {errors.title && <p className="text-red-400">{errors.title.message}</p>}
        {alreadyExistsError && <p className="text-red-400">Already taken</p>}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="category-description">Description (optional)</label>
        <textarea
          {...register('description')}
          name="categoryDescription"
          id="category-description"
          className="p-3 rounded-md shadow-md outline-none resize-none h-28"
          placeholder="Enter category description"
          rows={5}
        ></textarea>
        {errors.description && (
          <p className="text-red-400">{errors.description.message}</p>
        )}
      </div>
      <div className="flex items-center gap-2 mt-5">
        <button
          type="submit"
          className="px-7 py-3 bg-green-800 rounded-full text-neutral-50"
        >
          Create
        </button>
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="px-7 py-3 border border-green-800 rounded-full"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
