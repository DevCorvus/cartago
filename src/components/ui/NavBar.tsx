'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function NavBar() {
  const session = useSession();
  const isAuthenticated = session.status === 'authenticated';

  return (
    <nav className="fixed w-full flex items-center justify-between p-3 text-green-800 bg-slate-100 font-semibold shadow-md">
      <header>
        <Link href="/">eCommerce</Link>
      </header>
      <ul className="flex items-center gap-5 px-3 text-sm">
        <li>Cart</li>
        {!isAuthenticated && (
          <>
            <li>
              <Link href="/sign-in">Login</Link>
            </li>
            <li>
              <Link href="/sign-up">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
