'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserSchema } from '@/shared/schemas/user.schema';
import { CreateUserDto } from '@/shared/dtos/user.dto';
import { localStorageCart } from '@/utils/localStorageCart';
import { CreateCartItemDto } from '@/shared/dtos/cartItem.dto';
import { localStorageWished } from '@/utils/localStorageWished';
import { useCreateUser } from '@/data/user';
import { toastError } from '@/lib/toast';

export default function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [displayConfirmPassword, setDisplayConfirmPassword] = useState(false);

  const [isExportingData, setExportingData] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserDto>({
    resolver: zodResolver(createUserSchema),
  });

  const registerMutation = useCreateUser();

  const onSubmit: SubmitHandler<CreateUserDto> = async (data) => {
    if (isExportingData) {
      const wishedItems = localStorageWished.get();

      if (wishedItems.length) {
        data.wishedItems = wishedItems;
      }

      const cartItems: CreateCartItemDto[] = localStorageCart
        .get()
        .map((product) => ({ productId: product.id, amount: product.amount }));

      if (cartItems.length) {
        data.cartItems = cartItems;
      }
    }

    try {
      await registerMutation.mutateAsync(data);
    } catch {
      return;
    }

    try {
      const signInRes = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInRes?.ok && !signInRes.error) {
        const from = searchParams.get('from');
        if (from) {
          return router.push(from);
        } else {
          return router.refresh();
        }
      } else {
        toastError(signInRes?.error);
      }
    } catch (err) {
      toastError(err);
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!displayConfirmPassword && value.length >= 6) {
      setDisplayConfirmPassword(true);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-12 lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-10 rounded-lg bg-white p-10 shadow-md"
      >
        <header className="w-full">
          <h1 className="text-2xl font-bold text-cyan-700">Register</h1>
        </header>
        <section className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="fullname" className="text-slate-500">
              Name
            </label>
            <input
              {...register('fullname')}
              id="fullname"
              type="text"
              autoFocus
              placeholder="Enter your name"
              className="input p-3"
            />
            {errors.fullname && (
              <p className="text-red-400">{errors.fullname.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-slate-500">
              Email
            </label>
            <input
              {...register('email')}
              id="email"
              type="email"
              placeholder="Enter your email"
              className="input p-3"
            />
            {errors.email && (
              <p className="text-red-400">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-slate-500">
              Password
            </label>
            <input
              {...register('password')}
              id="password"
              type="password"
              placeholder="Enter your password"
              className="input p-3"
              onChange={handlePasswordChange}
            />
            {errors.password && (
              <p className="text-red-400">{errors.password.message}</p>
            )}
          </div>
          <div
            className={`${
              displayConfirmPassword ? 'block' : 'hidden'
            } space-y-2`}
          >
            <label htmlFor="confirmPassword" className="text-slate-500">
              Confirm password
            </label>
            <input
              {...register('confirmPassword')}
              id="confirmPassword"
              type="password"
              placeholder="Repeat your password"
              className="input p-3"
            />
            {errors.confirmPassword && (
              <p className="text-red-400">{errors.confirmPassword.message}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="export"
              className="h-4 w-4 bg-slate-50 accent-cyan-600"
              checked={isExportingData}
              onChange={(e) => setExportingData(e.target.checked)}
            />
            <label htmlFor="export" className="text-slate-500">
              Export cart and wished items
            </label>
          </div>
          {registerMutation.isError && (
            <p className="text-red-400">User already exists</p>
          )}
        </section>
        <button type="submit" className="btn w-full p-3">
          Sign Up
        </button>
      </form>
      <div className="text-center text-sm text-slate-500">
        <p>
          Do you already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold transition hover:text-cyan-500"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
