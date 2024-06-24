'use client';

import Link from 'next/link';
import SearchForm from './SearchForm';
import { HiShoppingCart, HiUser } from 'react-icons/hi2';
import { useEffect, useState } from 'react';
import DropdownMenu from './DropdownMenu';
import CartagoIcon from './svg/CartagoIcon';
import { useCartStore } from '@/stores/useCartStore';

export default function NavBar() {
  const [showMenu, setShowMenu] = useState(false);
  const [blurryBackground, setBlurryBackground] = useState(false);

  const cartItemsLength = useCartStore((state) => state.productIds.length);

  useEffect(() => {
    const handleScroll = () => {
      setBlurryBackground(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const hideDropdownMenu = () => {
    if (showMenu) {
      setShowMenu(false);
    }
  };

  return (
    <div
      className={`${blurryBackground ? 'bg-white/75 backdrop-blur-sm focus-within:bg-white focus-within:backdrop-blur-none hover:bg-white hover:backdrop-blur-none' : 'bg-white'} fixed z-50 w-full px-4 py-2 font-semibold text-cyan-700 shadow-md transition duration-500`}
    >
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
              className="relative rounded-full bg-cyan-50 p-1 text-cyan-600 shadow-sm transition hover:text-cyan-500 hover:shadow-md focus:text-cyan-500 focus:shadow-md"
            >
              {cartItemsLength > 0 && (
                <div className="size-4 absolute -right-1 -top-1 flex scale-90 items-center justify-center rounded-full bg-rose-400">
                  <span className="text-xs text-slate-50">
                    {cartItemsLength}
                  </span>
                </div>
              )}
              <HiShoppingCart />
            </Link>
          </li>
          <li className="flex items-center justify-center">
            <button
              type="button"
              onClick={() => setShowMenu((prev) => !prev)}
              className="rounded-full bg-cyan-50 p-1 text-cyan-600 shadow-sm transition hover:text-cyan-500 hover:shadow-md focus:text-cyan-500 focus:shadow-md"
            >
              <HiUser />
            </button>
          </li>
        </ul>
        <DropdownMenu show={showMenu} hide={hideDropdownMenu} />
      </nav>
    </div>
  );
}
