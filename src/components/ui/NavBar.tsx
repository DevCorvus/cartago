'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import SearchForm from './SearchForm';
import { useRouter } from 'next/navigation';
import { useIsAuthenticated } from '@/hooks/useIsAuthenticated';

export default function NavBar() {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();

  const handleSubmit = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <div className="bg-white text-green-800 font-semibold py-2 px-4 shadow-md fixed z-50 w-full">
      <nav className="container mx-auto flex items-center justify-between">
        <header>
          <Link href="/">eCommerce</Link>
        </header>
        <SearchForm />
        <ul className="flex items-center gap-5 text-sm">
          <li>
            <Link href="/cart">Cart</Link>
          </li>
          {!isAuthenticated ? (
            <>
              <li>
                <Link href="/sign-in">Login</Link>
              </li>
              <li>
                <Link href="/sign-up">Register</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <button onClick={handleSubmit}>Sign out</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}
