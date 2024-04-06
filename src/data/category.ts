import {
  CategoryDto,
  CategoryTagDto,
  CreateUpdateCategoryDto,
} from '@/shared/dtos/category.dto';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useCategories = () => {
  return useQuery<CategoryDto[]>({
    queryFn: async () => {
      const res = await fetch('/api/categories');

      if (!res.ok) {
        throw new Error('Could not get categories');
      }

      return res.json();
    },
    queryKey: ['categories'],
  });
};

export const getCategoryTags = async (
  input: string,
): Promise<CategoryTagDto[]> => {
  const res = await fetch(`/api/categories/tags?title=${input}`);

  if (!res.ok) {
    throw new Error('Could not get category tags');
  }

  return res.json();
};

export const useCreateCategory = () => {
  return useMutation({
    mutationFn: async (data: CreateUpdateCategoryDto): Promise<CategoryDto> => {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Could not create category');
      }

      return res.json();
    },
    mutationKey: ['createCategory'],
  });
};

interface UpdateCategoryInterface {
  categoryId: number;
  data: CreateUpdateCategoryDto;
}

export const useUpdateCategory = () => {
  return useMutation({
    mutationFn: async ({
      categoryId,
      data,
    }: UpdateCategoryInterface): Promise<CategoryDto> => {
      const res = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Could not update category');
      }

      return res.json();
    },
    mutationKey: ['updateCategory'],
  });
};

export const useDeleteCategory = () => {
  return useMutation({
    mutationFn: async (categoryId: number): Promise<CategoryDto> => {
      const res = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Could not delete category');
      }

      return res.json();
    },
    mutationKey: ['deleteCategory'],
  });
};
