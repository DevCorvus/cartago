import { z } from 'zod';

const MAX_FILE_SIZE = 1000 * 1000 * 1; // 1 MB
export const ACCEPTED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const priceInCentsSchema = z.number().int().min(100);

const priceSchema = z
  .string()
  .transform((price) => Math.round(parseFloat(price) * 100))
  .pipe(priceInCentsSchema);

export const createUpdatePartialProductSchema = z.object({
  title: z.string().min(10).max(150).trim(),
  description: z.string().max(200).trim(),
  price: priceSchema,
  stock: z.number().int().min(1),
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
