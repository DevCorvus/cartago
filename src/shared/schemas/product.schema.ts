import { zodNotProfaneString } from '@/lib/zod';
import { z } from 'zod';

const MAX_FILE_SIZE = 1000 * 1000 * 1; // 1 MB
export const ACCEPTED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const CENTS = 100;

const priceInCentsSchema = z
  .number()
  .int()
  .min(1 * CENTS)
  .max(99_999_999 * CENTS);

const priceFormSchema = z
  .string()
  .transform((price) => Math.round(parseFloat(price) * CENTS))
  .pipe(priceInCentsSchema);

export const productImageSchema = z
  .instanceof(File)
  .refine((file) => {
    return file.size <= MAX_FILE_SIZE;
  }, 'Max image size is 1MB')
  .refine((file) => {
    return ACCEPTED_IMAGE_MIME_TYPES.includes(file.type);
  }, 'Only jpeg, jpg, png and webp formats are supported');

export const productCategorySchema = z.number().int().positive();

export const createUpdateProductFormSchema = z.object({
  title: zodNotProfaneString(z.string().trim().min(10).max(150)),
  description: zodNotProfaneString(z.string().trim().max(500)),
  price: priceFormSchema,
  stock: z.number().int().min(1).max(1000),
  images: z.array(productImageSchema).min(1).max(5),
  categories: z.array(productCategorySchema).min(1).max(5),
});

export const createUpdateProductSchema = createUpdateProductFormSchema.extend({
  price: priceInCentsSchema,
});
