import Link from 'next/link';

export default function Admin() {
  return (
    <div className="max-w-md w-full flex flex-col gap-6">
      <header className="w-full">
        <h1 className="text-2xl font-bold text-green-800">Admin</h1>
      </header>
      <ul>
        <li>
          <Link
            href="/admin/categories"
            className="text-blue-400 hover:text-blue-500 focus:text-blue-500 transition"
          >
            Categories
          </Link>
        </li>
      </ul>
    </div>
  );
}
