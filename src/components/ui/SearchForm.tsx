'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { capitalize } from '@/utils/capitalize';
import Loading from './Loading';
import { CategoryTagDto } from '@/shared/dtos/category.dto';
import { getCategoryTags } from '@/data/category';
import { toastError } from '@/lib/toast';

export default function SearchForm() {
  const pathname = usePathname();

  const [input, setInput] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [categoryTags, setCategoryTags] = useState<CategoryTagDto[]>([]);

  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    clearTimeout(timeoutRef.current);

    if (input) {
      setLoading(true);
      timeoutRef.current = setTimeout(() => {
        (async () => {
          try {
            const data = await getCategoryTags(input);
            setCategoryTags(data);
          } catch (err) {
            toastError(err);
          } finally {
            setLoading(false);
          }
        })();
      }, 500);
    } else {
      setCategoryTags([]);
    }
  }, [input]);

  useEffect(() => {
    setInput('');
    setCategoryTags([]);
  }, [pathname]);

  return (
    <div className="font-sans font-normal">
      <form>
        <input
          type="text"
          className="resize-none rounded-lg bg-slate-50 p-2 text-black shadow-inner shadow-slate-300 outline-none"
          placeholder="Search"
          onChange={(e) => setInput(e.target.value.trim())}
          value={input}
        />
      </form>
      {input && (
        <div className="absolute w-80 rounded-b-lg bg-white px-2 py-4">
          {categoryTags.length === 0 ? (
            <>
              {isLoading ? (
                <Loading />
              ) : (
                <p className="text-center">Nothing here .(</p>
              )}
            </>
          ) : (
            <ul className="space-y-1">
              {categoryTags.map((category) => (
                <li key={category.id}>
                  <Link href={`/items?categoryId=${category.id}`}>
                    {capitalize(category.title)}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
