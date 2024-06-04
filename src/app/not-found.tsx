import Link from 'next/link';
import { HiOutlineEmojiSad } from 'react-icons/hi';

export default function NotFound() {
  return (
    <div className="absolute inset-0 flex h-screen w-screen items-center justify-center">
      <section className="max-w-md space-y-3 rounded-lg text-center text-slate-400">
        <header className="space-y-1">
          <HiOutlineEmojiSad className="mx-auto text-5xl" />
          <h1 className="font-semibold">Not found</h1>
        </header>
        <Link
          href="/items"
          className="inline-block w-56 text-xs italic hover:underline"
        >
          Go back Home
        </Link>
      </section>
    </div>
  );
}
