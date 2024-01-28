'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/stores/useCartStore';
import { localStorageCart } from '@/utils/localStorageCart';
import { useWishedItemStore } from '@/stores/useWishedItemStore';

export interface UserData {
  cartItemIds: string[];
  wishedItemIds: string[];
}

interface Props {
  children: React.ReactNode;
  data: UserData | null;
}

export default function UserProvider({ children, data }: Props) {
  const setCartItems = useCartStore((state) => state.setProductIds);
  const setWishedItems = useWishedItemStore((state) => state.setWishedItems);

  useEffect(() => {
    if (data) {
      localStorageCart.reset();

      setCartItems(data.cartItemIds);
      setWishedItems(data.wishedItemIds);
    } else {
      setCartItems(localStorageCart.get().map((product) => product.id));
      // TODO: Local storage for wished items
    }
  }, [data, setCartItems, setWishedItems]);

  return children;
}
