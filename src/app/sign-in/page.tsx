'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';

export default function SignIn() {
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (e.target instanceof HTMLFormElement) {
      const formData = new FormData(e.target);

      const res = await signIn('credentials', {
        email: formData.get('email'),
        password: formData.get('password'),
        redirect: false,
      });

      if (res?.ok && !res.error) {
        return router.push('/');
      } else {
        console.log(res?.error);
      }
    }
  };

  return (
    <div className="flex-1 bg-lime-50 flex items-center justify-center text-green-800">
      <div className="flex flex-col gap-12">
        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-center flex-col gap-10"
        >
          <header className="w-full ">
            <h1 className=" text-2xl font-bold">Sign In</h1>
          </header>
          <div className="flex flex-col gap-6 w-full">
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
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-green-800 p-3 w-full rounded-3xl text-slate-50 shadow-lg"
          >
            Log In
          </button>
        </form>
        <div className="flex items-center justify-center flex-col text-sm opacity-75">
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
