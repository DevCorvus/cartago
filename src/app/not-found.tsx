import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 pt-24">
      <header className="text-3xl font-bold text-green-800">
        <h1>Not Found</h1>
      </header>
      <Link href="/" className="text-green-700 transition hover:text-green-500">
        Go back to Home
      </Link>
    </div>
  );
}
