'use client';

import { useIsAuthenticated } from '@/hooks/useIsAuthenticated';
import { useCartStore } from '@/stores/useCartStore';
import { localStorageCart } from '@/utils/localStorageCart';
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
        localStorageCart.reset();

        const res = await fetch('/api/cart');
        if (res.ok) {
          const data = await res.json();
          setProductIds(data);
        }
      } else {
        setProductIds(localStorageCart.get().map((product) => product.id));
      }
    })();
  }, [isAuthenticated, setProductIds]);

  return children;
}
