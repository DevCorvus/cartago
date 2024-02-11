import { z } from 'zod';
import {
  createPartialProductSchema,
  createProductSchema,
} from '../schemas/product.schema';
import { CategoryTagDto } from './category.dto';

export interface ProductImageDto {
  path: string;
}

export interface ProductDto {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
  images: ProductImageDto[];
  categories: CategoryTagDto[];
}

export interface ProductCardDto {
  id: string;
  title: string;
  description: string;
  price: number;
  images: ProductImageDto[];
}

export interface ProductCartItemDto {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  amount: number;
  images: ProductImageDto[];
}

export type CreatePartialProductDto = z.infer<
  typeof createPartialProductSchema
>;

export type CreateProductDto = z.infer<typeof createProductSchema>;
