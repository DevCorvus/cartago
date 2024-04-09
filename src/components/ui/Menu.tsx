import { useIsAuthenticated } from '@/hooks/useIsAuthenticated';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Menu() {
  const isAuthenticated = useIsAuthenticated();

  const handleSubmit = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };
  return (
    <div className="w-screen h-screen absolute -top-2 -right-4 flex flex-col items-center justify-center gap-7 bg-white text-neutral-300 font-sans font-light md:w-auto md:h-auto md:top-16 md:p-10 md:left-auto">
      <section className="w-full flex flex-col gap-2 items-center">
        <ul className="flex flex-col items-center gap-3">
          <li>
            <Link href="/login" className="btn w-40 py-2 inline-block ">
              Login
            </Link>
          </li>
          <li>
            <Link
              href="/register"
              className="btn-alternative w-40 py-2 inline-block "
            >
              Register
            </Link>
          </li>
        </ul>
      </section>
      <section className="flex flex-col gap-2 items-center">
        <header>
          <h3>Client</h3>
        </header>
        <ul className="text-lime-500 flex flex-col gap-1 ">
          <li>
            <Link href="/account/orders">Orders</Link>
          </li>
          <li>
            <Link href="/items/wished">Wish list</Link>
          </li>
        </ul>
      </section>
      <section className="flex flex-col gap-2 items-center">
        <header>
          <h3>Seller</h3>
        </header>
        <ul className="text-lime-500 flex flex-col gap-1">
          <li>
            <Link href="/seller/products">Products</Link>
          </li>
        </ul>
      </section>
      <section className="flex flex-col gap-2 items-center">
        <header>
          <h3>Admin</h3>
        </header>
        <ul className="text-lime-500 flex flex-col gap-1">
          <li>
            <Link href="/admin/categories">Categories</Link>
          </li>
        </ul>
      </section>
      <section className="flex flex-col gap-2 items-center">
        <header>
          <h3>User</h3>
        </header>
        <ul className="text-lime-500 flex flex-col gap-1">
          <li>
            <Link href="">Account</Link>
          </li>
        </ul>
      </section>
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
    </div>
  );
}
