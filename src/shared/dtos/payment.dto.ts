import { z } from 'zod';
import {
  createPaymentSchema,
  paymentMethodSchema,
} from '../schemas/payment.schema';

export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type CreatePaymentDto = z.infer<typeof createPaymentSchema>;
