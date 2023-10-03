import { z } from 'zod';
import {
  createUserSchema,
  updateUserPasswordSchema,
} from '@/shared/schemas/user.schema';

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserPasswordDto = z.infer<typeof updateUserPasswordSchema>;
