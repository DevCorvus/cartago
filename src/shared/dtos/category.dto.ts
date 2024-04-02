import { z } from 'zod';
import { createUpdateCategorySchema } from '../schemas/category.schema';

export type CreateUpdateCategoryDto = z.infer<
  typeof createUpdateCategorySchema
>;

export interface CategoryDto {
  id: number;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryTagDto {
  id: number;
  title: string;
}
