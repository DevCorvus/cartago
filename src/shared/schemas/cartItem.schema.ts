import { z } from 'zod';

export const createCartItemSchema = z.object({
  productId: z.string().uuid(),
  amount: z.number().int().positive(),
});
