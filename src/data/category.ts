import { CategoryDto } from '@/shared/dtos/category.dto';

export const getCategories = async (): Promise<CategoryDto[]> => {
  const res = await fetch('/api/categories');
  return res.json();
};
