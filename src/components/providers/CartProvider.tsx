'use client';

import { useCartStore } from '@/stores/useCartStore';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

interface Props {
  children: React.ReactNode;
}

export default function CartProvider({ children }: Props) {
  const session = useSession();
  const setProductIds = useCartStore((state) => state.setProductIds);

  useEffect(() => {
    (async () => {
      if (session.status === 'authenticated') {
        const res = await fetch('/api/cart');
        if (res.ok) {
          const data = await res.json();
          setProductIds(data);
        }
      }
    })();
  }, [session.status, setProductIds]);

  return children;
}
