'use client';

import { UserSession } from '@/shared/auth/auth.types';
import { useSession } from 'next-auth/react';

export function useUser(): UserSession | null {
  const session = useSession();
  return session.data?.user || null;
}
