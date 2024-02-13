import { z } from 'zod';

export const paymentMethodSchema = z.enum(['BISON', 'HUMBLECARD', 'PAYMATE']);

export const createPaymentSchema = z.object({
  method: paymentMethodSchema,
});
