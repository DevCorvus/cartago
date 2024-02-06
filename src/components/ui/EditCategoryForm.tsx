'use client';

import {
  CategoryDto,
  CreateUpdateCategoryDto,
} from '@/shared/dtos/category.dto';
import { createUpdateCategorySchema } from '@/shared/schemas/category.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

interface Props {
  category: CategoryDto;
  updateCategory(data: CategoryDto): void;
  close(): void;
}

export default function EditCategoryForm({
  category,
  updateCategory,
  close,
}: Props) {
  const [alreadyExistsError, setAlreadyExistsError] = useState<boolean>(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateUpdateCategoryDto>({
    resolver: zodResolver(createUpdateCategorySchema),
    defaultValues: {
      title: category.title,
      description: category.description,
    },
  });

  const onSubmit: SubmitHandler<CreateUpdateCategoryDto> = async (data) => {
    setAlreadyExistsError(false);

    const res = await fetch(`/api/categories/${category.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const data: CategoryDto = await res.json();
      updateCategory(data);
      close();
    } else {
      setAlreadyExistsError(true);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 rounded-md bg-white shadow-md flex flex-col gap-4"
    >
      <header>
        <span className="text-xl font-bold text-green-800">
          Editing {category.title}
        </span>
      </header>
      <div className="flex flex-col gap-2">
        <label htmlFor="category-title" className="text-green-800 opacity-75">
          Title
        </label>
        <input
          {...register('title')}
          type="text"
          id="category-title"
          placeholder="Enter category title"
          className="p-3 input"
        />
        {errors.title && <p className="text-red-400">{errors.title.message}</p>}
        {alreadyExistsError && <p className="text-red-400">Already taken</p>}
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="category-description"
          className="text-green-800 opacity-75"
        >
          Description (optional)
        </label>
        <textarea
          {...register('description')}
          name="categoryDescription"
          id="category-description"
          className="p-3 textarea"
          placeholder="Enter category description"
        ></textarea>
        {errors.description && (
          <p className="text-red-400">{errors.description.message}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="px-5 py-2 bg-green-800 rounded-full text-neutral-50"
        >
          Apply
        </button>
        <button
          type="button"
          onClick={close}
          className="px-5 py-2 border border-green-800 text-green-800 rounded-full"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
