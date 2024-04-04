import { CategoryDto } from '@/shared/dtos/category.dto';
import { useQuery } from '@tanstack/react-query';

export const useCategories = () => {
  return useQuery<CategoryDto[]>({
    queryFn: async (): Promise<CategoryDto[]> => {
      const res = await fetch('/api/categories');

      if (!res.ok) {
        throw new Error('Coult not get categories');
      }

      return res.json();
    },
    queryKey: ['categories'],
  });
};
