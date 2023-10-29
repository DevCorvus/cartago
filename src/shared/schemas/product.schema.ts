import { z } from 'zod';

export const createProductSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number().int().min(0),
  stock: z.number().int().min(0),
  images: z.array(z.string()),
  categories: z.array(z.number().int()),
});
