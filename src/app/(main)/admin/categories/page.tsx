'use client';

import AddCategoryForm from '@/components/ui/AddCategoryForm';
import CategoryItem from '@/components/ui/CategoryItem';
import Loading from '@/components/ui/Loading';
import SearchInput from '@/components/ui/SearchInput';
import { CategoryDto } from '@/shared/dtos/category.dto';
import { useEffect, useState } from 'react';

export default function Categories() {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<CategoryDto[]>(
    [],
  );
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

  useEffect(() => {
    setSelectedCategories(categories);
  }, [categories]);

  const searchCategories = (title: string) => {
    const input = title.trim().toLowerCase();
    setSelectedCategories(
      categories.filter((category) => category.title.includes(input)),
    );
  };

  const addCategory = (data: CategoryDto) => {
    setCategories((prev) =>
      [...prev, data].toSorted((a, b) => {
        if (a.title > b.title) return 1;
        else if (a.title < b.title) return -1;
        return 0;
      }),
    );
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
      <SearchInput term="categories" handleSearch={searchCategories} />
      <ul className="flex flex-col gap-3">
        {selectedCategories.map((category) => (
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
