import Link from 'next/link';
import { HiOutlineShoppingCart } from 'react-icons/hi2';

export default function EmptyCart() {
  return (
    <div className="absolute inset-0 flex h-screen w-screen items-center justify-center">
      <section className="max-w-md space-y-3 rounded-lg text-center text-slate-400">
        <header className="space-y-1">
          <HiOutlineShoppingCart className="mx-auto text-5xl" />
          <h1 className="font-semibold">Cart is empty</h1>
        </header>
        <Link
          href="/items"
          className="inline-block w-56 text-xs italic hover:underline"
        >
          Add something to keep the wheels of capitalism rolling!
        </Link>
      </section>
    </div>
  );
}
