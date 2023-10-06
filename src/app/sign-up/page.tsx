'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useState } from 'react';

export default function SignUp() {
  const router = useRouter();
  const [displayConfirmPassword, setDisplayConfirmPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (e.target instanceof HTMLFormElement) {
      const formData = new FormData(e.target);

      const fullname = formData.get('fullname');
      const email = formData.get('email');
      const password = formData.get('password');

      try {
        const signUpRes = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fullname, email, password }),
        });

        if (!signUpRes.ok) throw new Error('User not created');

        const signInRes = await signIn('credentials', {
          email,
          password,
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
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!displayConfirmPassword && value.length >= 6) {
      setDisplayConfirmPassword(true);
    }
  };

  return (
    <div className="bg-lime-50 w-full h-full flex items-center justify-center text-green-800">
      <div className="flex flex-col gap-12">
        <form
          onSubmit={handleSubmit}
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
                id="fullname"
                name="fullname"
                type="text"
                placeholder="Write your name"
                className="rounded-lg p-4 outline-none text-sm shadow-md"
              />
            </div>
            <div className="flex justify-center flex-col gap-2">
              <label htmlFor="email" className="opacity-50">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="text"
                placeholder="Write your email"
                className="rounded-lg p-4 outline-none text-sm shadow-md"
              />
            </div>
            <div className="flex  gap-2 items-center">
              <label htmlFor="location" className="opacity-50">
                Location
              </label>
              <select
                name="location"
                id="location"
                className="p-1 opacity-75 border border-lime-700 rounded-lg outline-none"
              >
                <option defaultValue={''} disabled>
                  Select country
                </option>
                <option value="peru">Peru</option>
                <option value="venezuela">Venezuela</option>
                <option value="colombia">Colombia</option>
                <option value="Brasil">Brasil</option>
              </select>
            </div>
            <div className="flex justify-center flex-col gap-2">
              <label htmlFor="password" className="opacity-50">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Write your password"
                className="rounded-lg p-4 outline-none text-sm shadow-md"
                onChange={handlePasswordChange}
              />
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
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Write again your password"
                className="rounded-lg p-4 outline-none text-sm shadow-md"
              />
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
