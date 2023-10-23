import { z } from 'zod';

const passwordSchema = z.string().min(6).max(256);

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});

export const createUserSchema = z.object({
  fullname: z.string().min(4),
  email: z.string().email(),
  password: passwordSchema,
  location: z.string().length(2),
});

export const updateUserPasswordSchema = z.object({
  oldPassword: passwordSchema,
  newPassword: passwordSchema,
});
