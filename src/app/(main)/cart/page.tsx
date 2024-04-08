'use client';

import { useIsAuthenticated } from '@/hooks/useIsAuthenticated';
import UserShoppingCart from '@/components/ui/UserShoppingCart';
import GuestShoppingCart from '@/components/ui/GuestShoppingCart';

export default function Cart() {
  const isAuthenticated = useIsAuthenticated();
  return isAuthenticated ? <UserShoppingCart /> : <GuestShoppingCart />;
}
