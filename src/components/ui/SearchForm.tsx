'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { capitalize } from '@/utils/capitalize';
import Loading from './Loading';
import { CategoryTagDto } from '@/shared/dtos/category.dto';
import { getCategoryTags } from '@/data/category';
import { toastError } from '@/lib/toast';
import { HiMiniMagnifyingGlass } from 'react-icons/hi2';
import { HiOutlineEmojiSad } from 'react-icons/hi';

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
    <div className="max-w-72 relative flex-1 font-sans font-normal text-slate-700">
      <form className="flex items-center">
        <input
          type="text"
          className="w-full resize-none rounded-full bg-slate-50 px-4 py-2  shadow-inner shadow-slate-300 outline-none"
          placeholder="Search"
          onChange={(e) => setInput(e.target.value.trim())}
          value={input}
        />
        <HiMiniMagnifyingGlass className="absolute right-2 text-xl text-cyan-700" />
      </form>
      {input && (
        <div className="absolute top-12 w-full rounded-b-lg border-t border-slate-100 bg-slate-50 px-3 py-2 shadow-md">
          {categoryTags.length === 0 ? (
            <>
              {isLoading ? (
                <Loading />
              ) : (
                <p className="flex items-center justify-center gap-1 text-sm text-slate-500">
                  Nothing found <HiOutlineEmojiSad className="text-base" />
                </p>
              )}
            </>
          ) : (
            <ul>
              {categoryTags.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/items?categoryId=${category.id}`}
                    className="transition hover:text-cyan-500 focus:text-cyan-500"
                  >
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
