'use client';

import { CategoryDto } from '@/shared/dtos/category.dto';
import { capitalize } from '@/utils/capitalize';
import { useState } from 'react';
import { HiTrash, HiChevronDown, HiChevronUp, HiPencil } from 'react-icons/hi2';
import EditCategoryForm from './EditCategoryForm';

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
  const [editMode, setEditMode] = useState(false);

  const handleDelete = async (categoryId: number) => {
    const res = await fetch(`/api/categories/${categoryId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      deleteCategory(categoryId);
    }
  };

  if (editMode) {
    return (
      <EditCategoryForm
        category={category}
        updateCategory={updateCategory}
        close={() => setEditMode(false)}
      />
    );
  }

  return (
    <div className="p-4 rounded-md bg-white shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span>{capitalize(category.title)}</span>
          <button onClick={() => setShowDetails((prev) => !prev)}>
            {!showDetails ? <HiChevronDown /> : <HiChevronUp />}
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button
            title="Edit category"
            className="hover:text-green-700 focus:text-green-700 transition"
            onClick={() => setEditMode(true)}
          >
            <HiPencil />
          </button>
          <button
            title="Delete category"
            className="hover:text-red-600 focus:text-red-600 transition"
            onClick={() => handleDelete(category.id)}
          >
            <HiTrash />
          </button>
        </div>
      </div>
      {showDetails && (
        <div className="text-sm flex flex-col gap-4 mt-4">
          {category.description ? (
            <p>{category.description}</p>
          ) : (
            <span className="italic">No description</span>
          )}
          <div className="text-slate-500">
            <p>Created at {new Date(category.createdAt).toDateString()}</p>
            <p>Last update at {new Date(category.updatedAt).toDateString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}
