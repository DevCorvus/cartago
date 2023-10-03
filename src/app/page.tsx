'use client';

import { useSession } from 'next-auth/react';

export default function Home() {
  const session = useSession();

  if (session.status === 'authenticated') {
    console.log(session.data);
  }

  return (
    <main>
      <h1>Hello World!</h1>
    </main>
  );
}
