'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserSchema } from '@/shared/schemas/user.schema';
import { CreateUserDto } from '@/shared/dtos/user.dto';

export default function SignUpForm() {
  const router = useRouter();
  const [displayConfirmPassword, setDisplayConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserDto>({
    resolver: zodResolver(createUserSchema),
  });

  const onSubmit: SubmitHandler<CreateUserDto> = async (data) => {
    try {
      const signUpRes = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!signUpRes.ok) throw new Error('User not created');

      const signInRes = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInRes?.ok && !signInRes.error) {
        return router.push('/');
      } else {
        console.log(signInRes?.error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!displayConfirmPassword && value.length >= 6) {
      setDisplayConfirmPassword(true);
    }
  };

  return (
    <div className="flex flex-col gap-12 max-w-sm">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center justify-center flex-col gap-10"
      >
        <header className="w-full">
          <h1 className="text-2xl font-bold text-green-800">Register</h1>
        </header>
        <div className="flex flex-col gap-6 w-full">
          <div className="flex justify-center flex-col gap-2">
            <label htmlFor="fullname" className="text-green-800 opacity-75">
              Name
            </label>
            <input
              {...register('fullname')}
              id="fullname"
              type="text"
              placeholder="Enter your name"
              className="p-4 input-alternative"
            />
            {errors.fullname && (
              <p className="text-red-400">{errors.fullname.message}</p>
            )}
          </div>
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
              onChange={handlePasswordChange}
            />
            {errors.password && (
              <p className="text-red-400">{errors.password.message}</p>
            )}
          </div>
          <div
            className={`${
              displayConfirmPassword ? 'flex' : 'hidden'
            } justify-center flex-col gap-2`}
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
              className="p-4 input-alternative"
            />
            {errors.confirmPassword && (
              <p className="text-red-400">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>
        <button type="submit" className="p-3 w-full btn">
          Sign Up
        </button>
      </form>
      <div className="flex items-center justify-center flex-col opacity-75 text-green-800">
        <p>
          Do you already have an account?{' '}
          <Link
            href="sign-in"
            className="hover:text-lime-700 transition font-semibold"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
