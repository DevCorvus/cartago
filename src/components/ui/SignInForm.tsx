'use client';

import { toastError } from '@/lib/toast';
import { LoginUserDto } from '@/shared/dtos/user.dto';
import { loginUserSchema } from '@/shared/schemas/user.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import SubmitButton from './SubmitButton';

export function SignInForm() {
  const router = useRouter();

  const [isLoading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUserDto>({ resolver: zodResolver(loginUserSchema) });

  const onSubmit: SubmitHandler<LoginUserDto> = async (data) => {
    setLoading(true);
    setLoginError(false);

    try {
      const res = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.ok && !res.error) {
        router.refresh();
      } else {
        setLoginError(true);
      }
    } catch (err) {
      toastError(err);
    }

    setLoading(false);
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-12 lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-10 rounded-lg bg-white p-10 shadow-md"
      >
        <header className="w-full">
          <h1 className="text-2xl font-bold text-cyan-700">Login</h1>
        </header>
        <section className="w-full space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-slate-500">
              Email
            </label>
            <input
              {...register('email')}
              id="email"
              type="email"
              placeholder="Enter your email"
              autoFocus
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
            />
            {errors.password && (
              <p className="text-red-400">{errors.password.message}</p>
            )}
          </div>
          {loginError && (
            <p className="text-red-400">Wrong email or password</p>
          )}
        </section>
        <SubmitButton
          className="w-full p-3"
          disabled={isLoading}
          placeholder="Signin In"
        >
          Sign In
        </SubmitButton>
      </form>
      <div className="text-center text-sm text-slate-500">
        <p>
          You do not have an account?
          <Link
            href="/register"
            className="font-semibold transition hover:text-cyan-500"
          >
            {' '}
            Sign up here.
          </Link>
        </p>
      </div>
    </div>
  );
}
