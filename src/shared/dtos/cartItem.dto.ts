import { z } from 'zod';
import { createCartItemSchema } from '../schemas/cartItem.schema';

export type CreateCartItemDto = z.infer<typeof createCartItemSchema>;
