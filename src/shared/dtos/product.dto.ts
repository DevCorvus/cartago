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

export interface ProductDto {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  sales: number;
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

export interface ProductCardWithSalesDto extends ProductCardDto {
  sales: number;
}

export interface ProductDetailsDto {
  product: ProductDto;
  relatedProducts: ProductCardWithSalesDto[];
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
