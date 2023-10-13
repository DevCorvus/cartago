import { z } from 'zod';
import {
  createUserSchema,
  loginUserSchema,
  updateUserPasswordSchema,
} from '@/shared/schemas/user.schema';

export type LoginUserDto = z.infer<typeof loginUserSchema>;
export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserPasswordDto = z.infer<typeof updateUserPasswordSchema>;
