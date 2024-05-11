'use client';

import Link from 'next/link';
import SearchForm from './SearchForm';
import { HiShoppingCart, HiUser } from 'react-icons/hi2';
import { useState } from 'react';
import DropdownMenu from './DropdownMenu';
import CartagoIcon from './svg/CartagoIcon';

export default function NavBar() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div>
      <div className="fixed z-50 w-full bg-white px-4 py-2 font-semibold text-cyan-700 shadow-md">
        <nav className="container relative mx-auto flex items-center justify-between gap-1">
          <header className="flex justify-center">
            <Link
              href="/"
              className="group flex items-center gap-2 hover:text-cyan-500 focus:text-cyan-500"
            >
              <div className="size-8 flex items-center justify-center rounded-full border-2 border-cyan-700 transition group-hover:border-cyan-500 group-focus:border-cyan-500">
                <CartagoIcon className="w-3.5" />
              </div>
              <span className="text-xl">Cartago</span>
            </Link>
          </header>
          <SearchForm />
          <ul className="flex items-center justify-center gap-5 text-2xl">
            <li className="flex items-center justify-center">
              <Link
                href="/cart"
                className="rounded-full bg-cyan-50 p-1 shadow-sm transition hover:text-cyan-500 hover:shadow-md focus:text-cyan-500 focus:shadow-md"
              >
                <HiShoppingCart />
              </Link>
            </li>
            <li className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => setShowMenu((prev) => !prev)}
                className="rounded-full bg-cyan-50 p-1 shadow-sm transition hover:text-cyan-500 hover:shadow-md focus:text-cyan-500 focus:shadow-md"
              >
                <HiUser />
              </button>
            </li>
          </ul>
          {showMenu && <DropdownMenu setShowMenu={setShowMenu} />}
        </nav>
      </div>
    </div>
  );
}
