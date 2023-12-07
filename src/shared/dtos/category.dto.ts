import { z } from 'zod';
import { createUpdateCategorySchema } from '../schemas/category.schema';
import { ProductCardDto } from './product.dto';

export type CreateUpdateCategoryDto = z.infer<
  typeof createUpdateCategorySchema
>;

export interface CategoryTagDto {
  id: number;
  title: string;
}

export interface CategoryWithProducts {
  id: number;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  products: ProductCardDto[];
}
