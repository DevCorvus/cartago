import { z } from 'zod';
import { createCartItemSchema } from './cartItem.schema';
import { zodNotProfaneString } from '@/lib/zod';

const passwordSchema = z.string().min(6).max(256);

export const loginUserSchema = z.object({
  email: z.string().trim().email(),
  password: passwordSchema,
});

export const createUserSchema = z
  .object({
    fullname: zodNotProfaneString(z.string().trim().min(4)),
    email: z.string().trim().email(),
    password: passwordSchema,
    confirmPassword: z.string(),
    wishedItems: z.array(z.string().uuid()).optional(),
    cartItems: z.array(createCartItemSchema).optional(),
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
