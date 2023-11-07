import { z } from 'zod';

const passwordSchema = z.string().min(6).max(256);

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});

export const createUserSchema = z
  .object({
    fullname: z.string().min(4),
    email: z.string().email(),
    location: z.string().length(2),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords should match',
    path: ['confirmPassword'],
  });

export const updateUserPasswordSchema = z.object({
  oldPassword: passwordSchema,
  newPassword: passwordSchema,
});
