import { z } from 'zod';

const MAX_FILE_SIZE = 1000 * 1000 * 1; // 1 MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const productImageSchema = z
  .instanceof(File)
  .refine((file) => {
    return file.size <= MAX_FILE_SIZE;
  }, 'Max image size is 1MB')
  .refine((file) => {
    return ACCEPTED_IMAGE_TYPES.includes(file.type);
  }, 'Only .jpeg, jpg, .png and .webp formats are supported');

export const createProductSchema = z.object({
  title: z.string().min(10).max(150),
  description: z.string().max(200),
  price: z.number().int().min(0),
  stock: z.number().int().min(0),
  images: z.array(productImageSchema).max(5),
  categories: z.array(z.number().int()),
});
