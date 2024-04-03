import { CategoryDto } from '@/shared/dtos/category.dto';

export const getCategories = async (): Promise<CategoryDto[]> => {
  const res = await fetch('/api/categories');

  if (!res.ok) {
    throw new Error('Coult not get categories');
  }

  return res.json();
};
