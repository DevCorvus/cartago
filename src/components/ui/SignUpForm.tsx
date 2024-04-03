'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserSchema } from '@/shared/schemas/user.schema';
import { CreateUserDto } from '@/shared/dtos/user.dto';
import { localStorageCart } from '@/utils/localStorageCart';
import { CreateCartItemDto } from '@/shared/dtos/cartItem.dto';
import { localStorageWished } from '@/utils/localStorageWished';
import { useMutation } from '@tanstack/react-query';
import { createUser } from '@/data/user';

export default function SignUpForm() {
  const router = useRouter();

  const [displayConfirmPassword, setDisplayConfirmPassword] = useState(false);
  const [somethingWentWrongError, setSomethingWentWrongError] = useState(false);

  const [isExportingData, setExportingData] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserDto>({
    resolver: zodResolver(createUserSchema),
  });

  const registerMutation = useMutation({
    mutationFn: createUser,
    mutationKey: ['createUser'],
  });

  const onSubmit: SubmitHandler<CreateUserDto> = async (data) => {
    setSomethingWentWrongError(false);

    if (isExportingData) {
      const wishedItems = localStorageWished.get().map((product) => product.id);

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

      const signInRes = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInRes?.ok && !signInRes.error) {
        return router.refresh();
      } else {
        setSomethingWentWrongError(true);
      }
    } catch {
      // TODO: Handle error case
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!displayConfirmPassword && value.length >= 6) {
      setDisplayConfirmPassword(true);
    }
  };

  return (
    <div className="flex max-w-sm flex-col gap-12">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center gap-10"
      >
        <header className="w-full">
          <h1 className="text-2xl font-bold text-green-800">Register</h1>
        </header>
        <div className="flex w-full flex-col gap-6">
          <div className="flex flex-col justify-center gap-2">
            <label htmlFor="fullname" className="text-green-800 opacity-75">
              Name
            </label>
            <input
              {...register('fullname')}
              id="fullname"
              type="text"
              placeholder="Enter your name"
              className="input-alternative p-4"
            />
            {errors.fullname && (
              <p className="text-red-400">{errors.fullname.message}</p>
            )}
          </div>
          <div className="flex flex-col justify-center gap-2">
            <label htmlFor="email" className="text-green-800 opacity-75">
              Email
            </label>
            <input
              {...register('email')}
              id="email"
              type="email"
              placeholder="Enter your email"
              className="input-alternative p-4"
            />
            {errors.email && (
              <p className="text-red-400">{errors.email.message}</p>
            )}
          </div>
          <div className="flex flex-col justify-center gap-2">
            <label htmlFor="password" className="text-green-800 opacity-75">
              Password
            </label>
            <input
              {...register('password')}
              id="password"
              type="password"
              placeholder="Enter your password"
              className="input-alternative p-4"
              onChange={handlePasswordChange}
            />
            {errors.password && (
              <p className="text-red-400">{errors.password.message}</p>
            )}
          </div>
          <div
            className={`${
              displayConfirmPassword ? 'flex' : 'hidden'
            } flex-col justify-center gap-2`}
          >
            <label
              htmlFor="confirmPassword"
              className="text-green-800 opacity-75"
            >
              Confirm password
            </label>
            <input
              {...register('confirmPassword')}
              id="confirmPassword"
              type="password"
              placeholder="Repeat your password"
              className="input-alternative p-4"
            />
            {errors.confirmPassword && (
              <p className="text-red-400">{errors.confirmPassword.message}</p>
            )}
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="export"
              className="h-4 w-4 bg-slate-50 accent-green-800"
              checked={isExportingData}
              onChange={(e) => setExportingData(e.target.checked)}
            />
            <label htmlFor="export" className="text-green-800 opacity-75">
              Export cart and wished items
            </label>
          </div>
          <div className="space-y-2">
            {registerMutation.isError && (
              <p className="text-red-400">User already exists</p>
            )}
            {somethingWentWrongError && (
              <p className="text-red-400">Something went wrong</p>
            )}
          </div>
        </div>
        <button type="submit" className="btn w-full p-3">
          Sign Up
        </button>
      </form>
      <div className="flex flex-col items-center justify-center text-green-800 opacity-75">
        <p>
          Do you already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold transition hover:text-lime-700"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
