import { useClickOutside } from '@/hooks/useClickOutside';
import { useIsAuthenticated } from '@/hooks/useIsAuthenticated';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';

interface MenuProps {
  setShowMenu: Dispatch<SetStateAction<boolean>>;
}

export default function Menu({ setShowMenu }: MenuProps) {
  const isAuthenticated = useIsAuthenticated();

  const ref = useClickOutside<HTMLDivElement>(() => setShowMenu(false));

  const handleSubmit = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
    setShowMenu(false);
  };

  return (
    <div ref={ref} className="min-w-48 absolute right-0 top-14">
      <div className="space-y-4 rounded-lg bg-white p-6 font-normal text-lime-500 shadow-md">
        {!isAuthenticated && (
          <section>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/login"
                  className="btn inline-block w-full py-2"
                  onClick={() => setShowMenu(false)}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="btn-alternative inline-block w-full py-2"
                  onClick={() => setShowMenu(false)}
                >
                  Register
                </Link>
              </li>
            </ul>
          </section>
        )}
        <section className="flex flex-col items-center gap-2">
          <header className="text-neutral-300">
            <h3>Client</h3>
          </header>
          <ul className="space-y-1">
            <li className="flex items-center justify-center">
              <Link href="/items/wished" onClick={() => setShowMenu(false)}>
                Wish list
              </Link>
            </li>
          </ul>
        </section>
        <section className="flex flex-col items-center gap-2">
          <header className="text-neutral-300">
            <h3>Seller</h3>
          </header>
          <ul className="space-y-1">
            <li className="flex items-center justify-center">
              <Link href="/seller/products" onClick={() => setShowMenu(false)}>
                Products
              </Link>
            </li>
          </ul>
        </section>
        <section className="flex flex-col items-center gap-2">
          <header className="text-neutral-300">
            <h3>Admin</h3>
          </header>
          <ul className="space-y-1">
            <li className="flex items-center justify-center">
              <Link href="/admin/categories" onClick={() => setShowMenu(false)}>
                Categories
              </Link>
            </li>
          </ul>
        </section>
        <section className="flex flex-col items-center gap-2">
          <header className="text-neutral-300">
            <h3>User</h3>
          </header>
          <ul className="space-y-1">
            <li className="flex items-center justify-center">
              <Link href="/account" onClick={() => setShowMenu(false)}>
                Account
              </Link>
            </li>
            <li className="flex items-center justify-center">
              <Link href="/account/orders" onClick={() => setShowMenu(false)}>
                Orders
              </Link>
            </li>
          </ul>
        </section>
        {isAuthenticated && (
          <section>
            <ul>
              <li>
                <button
                  onClick={handleSubmit}
                  className="btn-alternative w-full py-2"
                >
                  Sign out
                </button>
              </li>
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
