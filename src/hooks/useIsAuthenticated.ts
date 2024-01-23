import { useSession } from 'next-auth/react';

export function useIsAuthenticated() {
  const session = useSession();
  return session.status === 'authenticated';
}
