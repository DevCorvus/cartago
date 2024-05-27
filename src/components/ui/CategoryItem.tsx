'use client';

import { CategoryDto } from '@/shared/dtos/category.dto';
import { capitalize } from '@/utils/capitalize';
import { useState } from 'react';
import { HiTrash, HiChevronDown, HiChevronUp, HiPencil } from 'react-icons/hi2';
import EditCategoryForm from './EditCategoryForm';
import { useDeleteCategory } from '@/data/category';
import { toastError } from '@/lib/toast';
import ConfirmModal from './ConfirmModal';

interface Props {
  category: CategoryDto;
  updateCategory(data: CategoryDto): void;
  deleteCategory(categoryId: number): void;
}

export default function CategoryItem({
  category,
  updateCategory,
  deleteCategory,
}: Props) {
  const [showDetails, setShowDetails] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const deleteCategoryMutation = useDeleteCategory();

  const handleDelete = async (categoryId: number) => {
    try {
      await deleteCategoryMutation.mutateAsync(category.id);
      deleteCategory(categoryId);
    } catch (err) {
      toastError(err);
    }
  };

  return (
    <>
      <div className="rounded-md bg-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-slate-700">
            <span className="font-medium">{capitalize(category.title)}</span>
            <button onClick={() => setShowDetails((prev) => !prev)}>
              {!showDetails ? <HiChevronDown /> : <HiChevronUp />}
            </button>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <button
              title="Edit category"
              className="transition hover:text-green-500 focus:text-green-500"
              onClick={() => setShowForm(true)}
            >
              <HiPencil />
            </button>
            <button
              title="Delete category"
              className="transition hover:text-red-400 focus:text-red-400"
              onClick={() => setShowDeleteConfirmation(true)}
            >
              <HiTrash />
            </button>
          </div>
        </div>
        {showDetails && (
          <div className="mt-4 flex flex-col gap-4 text-sm">
            {category.description ? (
              <p className="text-md hyphens-auto whitespace-pre-line break-words font-sans opacity-75">
                {category.description}
              </p>
            ) : (
              <span className="text-md font-sans italic text-slate-500/75">
                No description
              </span>
            )}
            <div className="text-slate-500">
              <p>Created at {new Date(category.createdAt).toDateString()}</p>
              <p>
                Last update at {new Date(category.updatedAt).toDateString()}
              </p>
            </div>
          </div>
        )}
      </div>
      {showForm && (
        <EditCategoryForm
          category={category}
          updateCategory={updateCategory}
          close={() => setShowForm(false)}
        />
      )}
      {showDeleteConfirmation && (
        <ConfirmModal
          action={() => handleDelete(category.id)}
          close={() => setShowDeleteConfirmation(false)}
        />
      )}
    </>
  );
}
