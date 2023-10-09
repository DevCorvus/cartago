'use client';

import { useSession } from 'next-auth/react';
import HeroImage from '@/components/ui/HeroImage';

export default function Home() {
  const session = useSession();

  if (session.status === 'authenticated') {
    console.log(session.data);
  }

  return (
    <div className="h-full">
      <HeroImage />
    </div>
  );
}
