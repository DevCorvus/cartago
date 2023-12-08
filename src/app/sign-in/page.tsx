'use client';

import { LoginUserDto } from '@/shared/dtos/user.dto';
import { loginUserSchema } from '@/shared/schemas/user.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';

export default function SignIn() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUserDto>({ resolver: zodResolver(loginUserSchema) });

  const onSubmit: SubmitHandler<LoginUserDto> = async (data) => {
    const res = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res?.ok && !res.error) {
      return router.push('/');
    } else {
      console.log(res?.error);
    }
  };

  return (
    <div className="flex items-center justify-center pt-20 pb-10">
      <div className="flex flex-col gap-12">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex items-center justify-center flex-col gap-10 max-w-sm"
        >
          <header className="w-full">
            <h1 className="text-2xl font-bold text-green-800">Sign In</h1>
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
                className="rounded-lg p-4 outline-none shadow-md"
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
                className="rounded-lg p-4 outline-none shadow-md"
              />
              {errors.password && (
                <p className="text-red-400">{errors.password.message}</p>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="bg-green-800 p-3 w-full rounded-3xl text-slate-50 shadow-lg"
          >
            Log In
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
    </div>
  );
}
