import { HiXMark } from 'react-icons/hi2';
import Portal from './Portal';
import { useClickOutside } from '@/hooks/useClickOutside';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  CategoryTagDto,
  CreateUpdateCategoryDto,
} from '@/shared/dtos/category.dto';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUpdateCategorySchema } from '@/shared/schemas/category.schema';
import { useState } from 'react';
import { useCategoryFormStore } from '@/stores/useCategoryFormStore';

interface Props {
  handleNewCategory(data: CategoryTagDto): void;
}

export default function AddCategoryFormModal({ handleNewCategory }: Props) {
  const { title, setCreatingCategory } = useCategoryFormStore(
    ({ title, setCreatingCategory }) => ({ title, setCreatingCategory }),
  );

  const closeModal = () => {
    setCreatingCategory(false);
  };

  const formRef = useClickOutside<HTMLFormElement>(closeModal);
  const [alreadyExistsError, setAlreadyExistsError] = useState<boolean>(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateUpdateCategoryDto>({
    resolver: zodResolver(createUpdateCategorySchema),
    defaultValues: {
      title,
    },
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
      const data: CategoryTagDto = await res.json();
      handleNewCategory(data);
      closeModal();
    } else {
      setAlreadyExistsError(true);
    }
  };

  return (
    <Portal id="modal-container">
      <div className="z-50 w-screen h-screen fixed top-0 left-0 bg-neutral-100 bg-opacity-50 flex flex-col items-center justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          ref={formRef}
          className="relative bg-lime-50 rounded-md shadow-lg p-8 flex flex-col gap-3 text-green-800"
        >
          <button
            type="button"
            className="text-xl absolute top-3 right-3"
            onClick={closeModal}
          >
            <HiXMark />
          </button>
          <header className="mb-3">
            <h1 className="text-2xl font-bold">Add category</h1>
          </header>
          <div className="flex flex-col gap-2">
            <label htmlFor="category-title">Title</label>
            <input
              {...register('title')}
              autoFocus={true}
              type="text"
              id="category-title"
              placeholder="Enter category title"
              className="p-3 rounded-md shadow-md outline-none"
            />
            {errors.title && (
              <p className="text-red-400">{errors.title.message}</p>
            )}
            {alreadyExistsError && (
              <p className="text-red-400">Already taken</p>
            )}
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
          <button
            type="submit"
            className="w-full p-3 bg-green-800 rounded-full text-neutral-50 mt-5"
          >
            Create
          </button>
        </form>
      </div>
    </Portal>
  );
}
