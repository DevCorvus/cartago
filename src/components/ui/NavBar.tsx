'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export default function NavBar() {
  const session = useSession();
  const isAuthenticated = session.status === 'authenticated';

  return (
    <div className="w-full h-12">
      <nav className="z-50 fixed w-full flex items-center justify-between py-3 px-4 text-green-800 bg-slate-100 font-semibold shadow-md">
        <header>
          <Link href="/">eCommerce</Link>
        </header>
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
                <button onClick={() => signOut()}>Sign out</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}
