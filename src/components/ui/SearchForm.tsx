'use client';

import { useEffect, useRef, useState } from 'react';

export default function SearchForm() {
  const [input, setInput] = useState<string>('');
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    clearTimeout(timeoutRef.current);

    if (input) {
      timeoutRef.current = setTimeout(() => {
        (async () => {
          const searchParams = new URLSearchParams();
          searchParams.append('title', input);

          const res = await fetch(`/api/categories?${searchParams.toString()}`);

          if (res.ok) {
            const categories = await res.json();
            // TODO: Show categories
          }
        })();
      }, 500);
    }
  }, [input]);

  return (
    <form>
      <input
        type="text"
        className="text-black font-sans font-normal p-2 rounded-lg shadow-inner resize-none bg-slate-50 shadow-slate-300 outline-none"
        placeholder="Search"
        onChange={(e) => setInput(e.target.value.trim())}
      />
    </form>
  );
}
