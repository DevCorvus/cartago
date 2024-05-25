'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  term: string;
  handleSearch(input: string): void;
  alternative?: boolean;
}

export default function SearchInput({
  term,
  handleSearch,
  alternative = false,
}: Props) {
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
      placeholder={`Search for ${term}`}
      className={`${alternative ? 'input-alternative' : 'input'} p-3`}
      onChange={(e) => setInput(e.target.value)}
    />
  );
}
