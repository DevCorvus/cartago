import { useEffect, useRef, useState } from 'react';

export function useObserver(options?: IntersectionObserverInit) {
  const observerTarget = useRef(null);
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => setVisible(entries[0].isIntersecting),
      options,
    );

    const target = observerTarget.current;

    if (observerTarget.current) observer.observe(observerTarget.current);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [observerTarget, options]);

  return { observerTarget, isVisible };
}
