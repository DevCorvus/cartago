'use client';

import { useSession } from 'next-auth/react';
import HeroImage from '@/components/ui/HeroImage';

export default function Home() {
  const session = useSession();

  if (session.status === 'authenticated') {
    console.log(session.data);
  }

  return (
    <div className="h-screen lg:h-[60vh] lg:pt-12">
      <HeroImage />
    </div>
  );
}
