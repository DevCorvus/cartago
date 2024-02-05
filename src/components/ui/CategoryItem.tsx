'use client';

import { CategoryDto } from '@/shared/dtos/category.dto';
import { capitalize } from '@/utils/capitalize';
import { useState } from 'react';
import { HiTrash, HiChevronDown, HiChevronUp, HiPencil } from 'react-icons/hi2';

interface Props {
  category: CategoryDto;
}

export default function CategoryItem({ category }: Props) {
  const [showDetails, setShowDetails] = useState(false);

  const handleDelete = async (categoryId: number) => {
    await fetch(`/api/categories/${categoryId}`, { method: 'DELETE' });
  };

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
          <button>
            <HiPencil />
          </button>
          <button onClick={() => handleDelete(category.id)}>
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
            <p>Created at {category.createdAt.toDateString()}</p>
            <p>Last update at {category.updatedAt.toDateString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}
