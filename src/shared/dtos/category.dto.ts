import { z } from 'zod';
import { createUpdateCategorySchema } from '../schemas/category.schema';
import { ProductCardWithSalesDto } from './product.dto';

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

export interface CategoryWithProductsDto {
  id: number;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  products: ProductCardWithSalesDto[];
}
