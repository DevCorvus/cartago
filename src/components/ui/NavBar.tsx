'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import SearchForm from './SearchForm';
import { useIsAuthenticated } from '@/hooks/useIsAuthenticated';

export default function NavBar() {
  const isAuthenticated = useIsAuthenticated();

  const handleSubmit = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  return (
    <div className="fixed z-50 w-full bg-white px-4 py-2 font-semibold text-green-800 shadow-md">
      <nav className="container mx-auto flex items-center justify-between">
        <header>
          <Link href="/">eCommerce</Link>
        </header>
        <SearchForm />
        <ul className="flex items-center gap-5 text-sm">
          <li>
            <Link href="/cart">Cart</Link>
          </li>
          <li>
            <Link href="/items/wished">Wish List</Link>
          </li>
          {!isAuthenticated ? (
            <>
              <li>
                <Link href="/login">Login</Link>
              </li>
              <li>
                <Link href="/register">Register</Link>
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
