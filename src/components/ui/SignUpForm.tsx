'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import { CountryDto } from '@/shared/dtos/country.dto';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserSchema } from '@/shared/schemas/user.schema';
import { CreateUserDto } from '@/shared/dtos/user.dto';

interface Props {
  countries: CountryDto[];
}

export default function SignUpForm({ countries }: Props) {
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
    <div className="flex-1 bg-lime-50 flex items-center justify-center text-green-800">
      <div className="flex flex-col gap-12">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex items-center justify-center flex-col gap-10"
        >
          <header className="w-full ">
            <h1 className=" text-2xl font-bold">Sign Up</h1>
          </header>
          <div className="flex flex-col gap-6 w-full">
            <div className="flex justify-center flex-col gap-2">
              <label htmlFor="fullname" className="opacity-50">
                Name
              </label>
              <input
                {...register('fullname')}
                id="fullname"
                type="text"
                placeholder="Enter your name"
                className="rounded-lg p-4 outline-none text-sm shadow-md"
              />
              {errors.fullname && (
                <p className="text-red-400">{errors.fullname.message}</p>
              )}
            </div>
            <div className="flex justify-center flex-col gap-2">
              <label htmlFor="email" className="opacity-50">
                Email
              </label>
              <input
                {...register('email')}
                id="email"
                type="email"
                placeholder="Enter your email"
                className="rounded-lg p-4 outline-none text-sm shadow-md"
              />
              {errors.email && (
                <p className="text-red-400">{errors.email.message}</p>
              )}
            </div>
            <div className="flex flex-col  gap-2 items-start">
              <label htmlFor="location" className="opacity-50">
                Location
              </label>
              <select
                {...register('location')}
                id="location"
                className="p-1 opacity-75 border border-lime-700 rounded-lg outline-none"
              >
                <option defaultValue={''} disabled>
                  Select country
                </option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
              {errors.location && (
                <p className="text-red-400">{errors.location.message}</p>
              )}
            </div>
            <div className="flex justify-center flex-col gap-2">
              <label htmlFor="password" className="opacity-50">
                Password
              </label>
              <input
                {...register('password')}
                id="password"
                type="password"
                placeholder="Enter your password"
                className="rounded-lg p-4 outline-none text-sm shadow-md"
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
              <label htmlFor="confirmPassword" className="opacity-50">
                Confirm password
              </label>
              <input
                {...register('confirmPassword')}
                id="confirmPassword"
                type="password"
                placeholder="Repeat your password"
                className="rounded-lg p-4 outline-none text-sm shadow-md"
              />
              {errors.confirmPassword && (
                <p className="text-red-400">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="bg-green-800 p-3 w-full rounded-3xl text-slate-50 shadow-lg"
          >
            Sign Up
          </button>
        </form>
        <div className="flex items-center justify-center flex-col text-sm opacity-75">
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
    </div>
  );
}
