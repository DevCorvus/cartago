'use client';

import AddCategoryForm from '@/components/ui/AddCategoryForm';
import CategoryItem from '@/components/ui/CategoryItem';
import Loading from '@/components/ui/Loading';
import SearchInput from '@/components/ui/SearchInput';
import SomethingWentWrong from '@/components/ui/SomethingWentWrong';
import { useCategories } from '@/data/category';
import { CategoryDto } from '@/shared/dtos/category.dto';
import { useEffect, useState } from 'react';
import { HiMiniPlus } from 'react-icons/hi2';

export default function Categories() {
  const [showForm, setShowForm] = useState(false);

  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<CategoryDto[]>(
    [],
  );

  const { isLoading, isError, data } = useCategories();

  useEffect(() => {
    if (data) setCategories(data);
  }, [data]);

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
  if (isError) return <SomethingWentWrong />;

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-cyan-700">Categories</h1>
      </header>
      <button
        onClick={() => setShowForm(true)}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-neutral-100 bg-white p-3 font-semibold text-cyan-600 shadow-sm transition hover:text-cyan-500 hover:shadow-md focus:text-cyan-500 focus:shadow-md"
      >
        <HiMiniPlus className="text-3xl" />
        Add category
      </button>
      <SearchInput
        term="categories"
        handleSearch={searchCategories}
        alternative
      />
      <ul className="space-y-3">
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
      {showForm && (
        <AddCategoryForm
          addCategory={addCategory}
          close={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
