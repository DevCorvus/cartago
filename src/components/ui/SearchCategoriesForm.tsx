'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  handleSearch(input: string): void;
}

export default function SearchCategoriesForm({ handleSearch }: Props) {
  const [input, setInput] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      handleSearch(input);
    }, 500);
  }, [input, handleSearch]);

  return (
    <input
      type="text"
      placeholder="Search for categories"
      className="p-3 input"
      onChange={(e) => setInput(e.target.value)}
    />
  );
}
