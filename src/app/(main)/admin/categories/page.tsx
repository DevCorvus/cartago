'use client';

import AddCategoryForm from '@/components/ui/AddCategoryForm';
import CategoryItem from '@/components/ui/CategoryItem';
import Loading from '@/components/ui/Loading';
import { CategoryDto } from '@/shared/dtos/category.dto';
import { useEffect, useState } from 'react';

export default function Categories() {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/categories');

      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }

      setLoading(false);
    })();
  }, []);

  const addCategory = (data: CategoryDto) => {
    setCategories((prev) => [...prev, data]);
  };

  const updateCategory = (data: CategoryDto) => {
    setCategories((prev) =>
      prev.map((category) => {
        if (category.id === data.id) {
          return data;
        }
        return category;
      }),
    );
  };

  const deleteCategory = (categoryId: number) => {
    setCategories((prev) =>
      prev.filter((category) => category.id !== categoryId),
    );
  };

  if (isLoading) return <Loading />;

  return (
    <div className="w-full flex flex-col gap-6">
      <header>
        <h1 className="text-green-800 font-bold text-2xl">Categories</h1>
      </header>
      <AddCategoryForm addCategory={addCategory} />
      <ul className="flex flex-col gap-3">
        {categories.map((category) => (
          <li key={category.id}>
            <CategoryItem
              category={category}
              updateCategory={updateCategory}
              deleteCategory={deleteCategory}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
