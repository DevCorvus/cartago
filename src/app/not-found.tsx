import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="h-full flex gap-3 flex-col items-center justify-center">
      <header className="text-3xl font-bold text-green-800">
        <h1>Not Found</h1>
      </header>
      <Link href="/" className="text-green-700 hover:text-green-500 transition">
        Go back to Home
      </Link>
    </div>
  );
}
