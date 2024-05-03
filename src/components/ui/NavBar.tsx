'use client';

import Link from 'next/link';
import SearchForm from './SearchForm';
import { HiShoppingCart, HiUser } from 'react-icons/hi2';
import { useState } from 'react';
import Menu from './Menu';
import CartagoIcon from './svg/CartagoIcon';

export default function NavBar() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div>
      <div className="fixed z-50 w-full bg-lime-500 px-4 py-2 font-semibold text-white shadow-md">
        <nav className="container relative mx-auto flex items-center justify-between">
          <header className="flex justify-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="size-8 flex items-center justify-center rounded-full border-2 border-white">
                <CartagoIcon className="w-3.5 text-white" />
              </div>
              <span className="text-xl">Cartago</span>
            </Link>
          </header>
          <SearchForm />
          <ul className="flex items-center justify-center gap-5 text-2xl">
            <li className="flex items-center justify-center">
              <Link href="/cart">
                <HiShoppingCart />
              </Link>
            </li>
            <li className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => setShowMenu((prev) => !prev)}
              >
                <HiUser />
              </button>
            </li>
          </ul>
          {showMenu && <Menu setShowMenu={setShowMenu} />}
        </nav>
      </div>
    </div>
  );
}
