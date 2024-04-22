import { MutableRefObject, useEffect, useState } from 'react';

export function useCursorPosition<T extends HTMLElement | null>(
  ref?: MutableRefObject<T>,
) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const element = ref?.current;

    const getCursorPosition = (e: MouseEvent) => {
      if (element) {
        const rect = element.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      } else {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    };

    if (element) {
      element.addEventListener('mousemove', getCursorPosition);
    } else {
      document.addEventListener('mousemove', getCursorPosition);
    }
    return () => {
      if (element) {
        element.removeEventListener('mousemove', getCursorPosition);
      } else {
        document.removeEventListener('mousemove', getCursorPosition);
      }
    };
  }, [ref]);

  return position;
}
