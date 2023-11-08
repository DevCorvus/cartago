import { z } from 'zod';
import {
  createPartialProductSchema,
  createProductSchema,
} from '../schemas/product.schema';
import { Category, Product, ProductImage } from '@prisma/client';

// Temp
export interface ProductDto extends Product {
  images: ProductImage[];
  categories: Category[];
}

export type CreatePartialProductDto = z.infer<
  typeof createPartialProductSchema
>;

export type CreateProductDto = z.infer<typeof createProductSchema>;
