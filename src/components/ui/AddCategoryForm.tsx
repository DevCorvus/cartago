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
        className="w-full border border-transparent border-t-gray-100 hover:border-green-700 focus:border-green-700 transition p-3 rounded-full shadow-md bg-white text-green-800 font-semibold flex items-center justify-center gap-2"
      >
        <HiMiniPlus className="text-3xl" />
        Add category
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-md shadow-md p-6 flex flex-col gap-4 border-2 border-gray-50"
    >
      <header>
        <h1 className="text-xl font-bold text-green-800">New category</h1>
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
        <button type="submit" className="px-5 py-2 btn">
          Create
        </button>
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="px-5 py-2 btn-alternative"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
