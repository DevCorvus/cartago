import { z } from 'zod';

const MAX_FILE_SIZE = 1000 * 1000 * 1; // 1 MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const createPartialProductSchema = z.object({
  title: z.string().min(10).max(150),
  description: z.string().max(200),
  price: z.number().int().min(0),
  stock: z.number().int().min(0),
});

export const productImageSchema = z
  .instanceof(File)
  .refine((file) => {
    return file.size <= MAX_FILE_SIZE;
  }, 'Max image size is 1MB')
  .refine((file) => {
    return ACCEPTED_IMAGE_TYPES.includes(file.type);
  }, 'Only .jpeg, jpg, .png and .webp formats are supported');

export const productCategorySchema = z.number().int().positive();

export const createProductSchema = createPartialProductSchema.extend({
  images: z.array(productImageSchema).max(5),
  categories: z.array(productCategorySchema).max(5),
});
