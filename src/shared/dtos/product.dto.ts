import { z } from 'zod';
import {
  createUpdatePartialProductSchema,
  createUpdateProductSchema,
} from '../schemas/product.schema';
import { CategoryTagDto } from './category.dto';

export type CreateUpdatePartialProductDto = z.infer<
  typeof createUpdatePartialProductSchema
>;

export type CreateUpdateProductDto = z.infer<typeof createUpdateProductSchema>;

export interface ProductImageDto {
  path: string;
}

export interface ProductRating {
  score: number;
  count: number;
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

export interface NewProductDto {
  id: string;
}

export interface ProductCard {
  id: string;
  title: string;
  description: string;
  price: number;
  images: ProductImageDto[];
}

export interface ProductCardDto extends ProductCard {
  sales: number;
  rating: ProductRating;
}

export interface ProductDetailsDto {
  product: ProductDto & { sales: number; rating: ProductRating };
  relatedProducts: ProductCardDto[];
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

export interface ProductCartItemWithoutAmountDto {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  images: ProductImageDto[];
}

export interface ProductCartItemMinimalDto {
  id: string;
  amount: number;
}
