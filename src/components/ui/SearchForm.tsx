'use client';

import { CategoryTagDto } from '@/shared/dtos/category.dto';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { capitalize } from '@/utils/capitalize';

export default function SearchForm() {
  const [input, setInput] = useState<string>('');
  const [categories, setCategories] = useState<CategoryTagDto[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const pathname = usePathname();

  useEffect(() => {
    clearTimeout(timeoutRef.current);

    if (input) {
      timeoutRef.current = setTimeout(() => {
        (async () => {
          const searchParams = new URLSearchParams();
          searchParams.append('title', input);

          const res = await fetch(
            `/api/categories/tags?${searchParams.toString()}`,
          );

          if (res.ok) {
            const data = await res.json();
            setCategories(data);
          }
        })();
      }, 500);
    } else {
      setCategories([]);
    }
  }, [input]);

  useEffect(() => {
    setInput('');
    setCategories([]);
  }, [pathname]);

  return (
    <div className="font-sans font-normal">
      <form>
        <input
          type="text"
          className="p-2 input"
          placeholder="Search"
          onChange={(e) => setInput(e.target.value.trim())}
          value={input}
        />
      </form>
      {categories.length !== 0 && (
        <ul className="w-80 px-2 py-4 rounded-b-lg bg-white absolute flex flex-col gap-1">
          {categories.map((category) => (
            <li key={category.id}>
              <Link href={`/items?categoryId=${category.id}`}>
                {capitalize(category.title)}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
