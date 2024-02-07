'use client';

import { LoginUserDto } from '@/shared/dtos/user.dto';
import { loginUserSchema } from '@/shared/schemas/user.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';

export function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUserDto>({ resolver: zodResolver(loginUserSchema) });

  const onSubmit: SubmitHandler<LoginUserDto> = async (data) => {
    await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: true,
      callbackUrl: '/',
    });
  };

  return (
    <div className="flex flex-col gap-12">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center justify-center flex-col gap-10 max-w-sm"
      >
        <header className="w-full">
          <h1 className="text-2xl font-bold text-green-800">Login</h1>
        </header>
        <div className="flex flex-col gap-6 w-full">
          <div className="flex justify-center flex-col gap-2">
            <label htmlFor="email" className="text-green-800 opacity-75">
              Email
            </label>
            <input
              {...register('email')}
              id="email"
              type="email"
              placeholder="Enter your email"
              className="p-4 input-alternative"
            />
            {errors.email && (
              <p className="text-red-400">{errors.email.message}</p>
            )}
          </div>
          <div className="flex justify-center flex-col gap-2">
            <label htmlFor="password" className="text-green-800 opacity-75">
              Password
            </label>
            <input
              {...register('password')}
              id="password"
              type="password"
              placeholder="Enter your password"
              className="p-4 input-alternative"
            />
            {errors.password && (
              <p className="text-red-400">{errors.password.message}</p>
            )}
          </div>
        </div>
        <button type="submit" className="p-3 w-full btn">
          Sign In
        </button>
      </form>
      <div className="flex items-center justify-center flex-col text-sm text-green-800 opacity-75">
        <p>
          You do not have an account?
          <Link
            href="sign-up"
            className="hover:text-lime-700 transition font-semibold"
          >
            {' '}
            Sign up here.
          </Link>
        </p>
      </div>
    </div>
  );
}
