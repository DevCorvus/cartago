import { z } from 'zod';

const passwordSchema = z.string().min(6).max(256);

export const loginUserSchema = z.object({
  email: z.string().email().trim(),
  password: passwordSchema,
});

export const createUserSchema = z
  .object({
    fullname: z.string().min(4).trim(),
    email: z.string().email().trim(),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

export const updateUserPasswordSchema = z
  .object({
    oldPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: 'New password must be different',
    path: ['newPassword'],
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords must match',
    path: ['confirmNewPassword'],
  });
