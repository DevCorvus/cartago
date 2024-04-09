'use client';

import Link from 'next/link';
import SearchForm from './SearchForm';
import { useIsAuthenticated } from '@/hooks/useIsAuthenticated';
import { HiShoppingCart, HiUser } from 'react-icons/hi2';
import { useState } from 'react';
import Menu from './Menu';

export default function NavBar() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div>
      <div className="fixed z-50 w-full bg-lime-500 px-4 py-2 font-semibold text-white shadow-md">
        <nav className="container mx-auto flex items-center justify-between relative">
          <header>
            <Link href="/">eCommerce</Link>
          </header>
          <SearchForm />
          <ul className="flex items-center gap-5 text-sm">
            <li className="text-2xl">
              <Link href="/cart">
                <HiShoppingCart />
              </Link>
            </li>
            <li className="text-2xl">
              <button
                type="button"
                onClick={() => setShowMenu((prev) => !prev)}
              >
                <HiUser />
              </button>
            </li>
          </ul>
          {showMenu && <Menu />}
        </nav>
      </div>
    </div>
  );
}
