'use client';

import { useIsAuthenticated } from '@/hooks/useIsAuthenticated';
import { useCartStore } from '@/stores/useCartStore';
import { useEffect } from 'react';

interface Props {
  children: React.ReactNode;
}

export default function CartProvider({ children }: Props) {
  const isAuthenticated = useIsAuthenticated();
  const setProductIds = useCartStore((state) => state.setProductIds);

  useEffect(() => {
    (async () => {
      if (isAuthenticated) {
        const res = await fetch('/api/cart');
        if (res.ok) {
          const data = await res.json();
          setProductIds(data);
        }
      }
    })();
  }, [isAuthenticated, setProductIds]);

  return children;
}
