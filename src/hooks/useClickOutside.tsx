import { useEffect, useRef, useState } from 'react';

interface Options {
  disable?: boolean;
}

export function useClickOutside<T extends HTMLElement>(
  cb: Function,
  options?: Options,
) {
  const ref = useRef<T>(null);
  const [disable, setDisable] = useState(options?.disable);

  useEffect(() => {
    setTimeout(() => {
      setDisable(!!options?.disable);
    });
  }, [options?.disable]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!disable && ref.current && !ref.current.contains(e.target as Node)) {
        cb();
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [ref, cb, disable]);

  return ref;
}
