import { useIsAuthenticated } from '@/hooks/useIsAuthenticated';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';
import { HiXMark } from 'react-icons/hi2';

interface MenuProps {
  setShowMenu: Dispatch<SetStateAction<boolean>>;
}

export default function Menu({ setShowMenu }: MenuProps) {
  const isAuthenticated = useIsAuthenticated();

  const handleSubmit = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
    setShowMenu(false);
  };
  return (
    <div className="w-screen h-screen absolute -top-2 -right-4 flex flex-col items-center justify-center gap-7 bg-white text-neutral-300 font-sans font-light md:w-auto md:h-auto md:top-16 md:p-10 md:left-auto md:rounded-2xl">
      <button
        type="button"
        onClick={() => setShowMenu(false)}
        className="absolute top-3 right-3 text-3xl md:hidden"
      >
        <HiXMark />
      </button>
      {!isAuthenticated && (
        <section className="w-full flex flex-col gap-2 items-center">
          <ul className="flex flex-col items-center gap-3">
            <li>
              <Link
                href="/login"
                className="btn w-40 py-2 inline-block"
                onClick={() => setShowMenu(false)}
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                href="/register"
                className="btn-alternative w-40 py-2 inline-block"
                onClick={() => setShowMenu(false)}
              >
                Register
              </Link>
            </li>
          </ul>
        </section>
      )}
      <section className="flex flex-col gap-2 items-center">
        <header>
          <h3>Client</h3>
        </header>
        <ul className="text-lime-500 flex flex-col gap-1 ">
          <li>
            <Link href="/account/orders" onClick={() => setShowMenu(false)}>
              Orders
            </Link>
          </li>
          <li>
            <Link href="/items/wished" onClick={() => setShowMenu(false)}>
              Wish list
            </Link>
          </li>
        </ul>
      </section>
      <section className="flex flex-col gap-2 items-center">
        <header>
          <h3>Seller</h3>
        </header>
        <ul className="text-lime-500 flex flex-col gap-1">
          <li>
            <Link href="/seller/products" onClick={() => setShowMenu(false)}>
              Products
            </Link>
          </li>
        </ul>
      </section>
      <section className="flex flex-col gap-2 items-center">
        <header>
          <h3>Admin</h3>
        </header>
        <ul className="text-lime-500 flex flex-col gap-1">
          <li>
            <Link href="/admin/categories" onClick={() => setShowMenu(false)}>
              Categories
            </Link>
          </li>
        </ul>
      </section>
      <section className="flex flex-col gap-2 items-center">
        <header>
          <h3>User</h3>
        </header>
        <ul className="text-lime-500 flex flex-col gap-1">
          <li>
            <Link href="" onClick={() => setShowMenu(false)}>
              Account
            </Link>
          </li>
        </ul>
      </section>
      {isAuthenticated && (
        <section className="flex flex-col gap-2 items-center">
          <ul>
            <li>
              <button
                onClick={handleSubmit}
                className="btn-alternative w-40 py-2"
              >
                Sign out
              </button>
            </li>
          </ul>
        </section>
      )}
    </div>
  );
}
