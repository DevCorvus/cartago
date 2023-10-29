import { z } from 'zod';
import { createProductSchema } from '../schemas/product.schema';
import { Category, Product, ProductImage } from '@prisma/client';

// Temp
export interface ProductDto extends Product {
  images: ProductImage[];
  categories: Category[];
}

export type CreateProductDto = z.infer<typeof createProductSchema>;
