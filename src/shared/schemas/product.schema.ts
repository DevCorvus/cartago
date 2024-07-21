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

const priceSchema = z
  .string()
  .transform((price) => Math.round(parseFloat(price) * CENTS))
  .pipe(priceInCentsSchema);

export const createUpdatePartialProductSchema = z.object({
  title: zodNotProfaneString(z.string().min(10).max(150).trim()),
  description: zodNotProfaneString(z.string().max(500).trim()),
  price: priceSchema,
  stock: z.number().int().min(1).max(1000),
});

export const productImageSchema = z
  .instanceof(File)
  .refine((file) => {
    return file.size <= MAX_FILE_SIZE;
  }, 'Max image size is 1MB')
  .refine((file) => {
    return ACCEPTED_IMAGE_MIME_TYPES.includes(file.type);
  }, 'Only .jpeg, jpg, .png and .webp formats are supported');

export const productCategorySchema = z.number().int().positive();

export const createProductSchema = createUpdatePartialProductSchema.extend({
  price: priceInCentsSchema,
  images: z.array(productImageSchema).min(1).max(5),
  categories: z.array(productCategorySchema).min(1).max(5),
});

export const updateProductSchema = createProductSchema.extend({
  imageFilenamesToKeep: z.array(z.string()).max(5),
});
