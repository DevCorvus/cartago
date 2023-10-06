'use client';

import { useSession } from 'next-auth/react';
import NavBar from '@/components/ui/NavBar';

export default function Home() {
  const session = useSession();

  if (session.status === 'authenticated') {
    console.log(session.data);
  }

  return (
    <div className="h-full text-lime-50 ">
      <NavBar />
      <div className="h-full  flex flex-col items-center justify-center gap-5  bg-cover bg-[url('https://images.pexels.com/photos/6207736/pexels-photo-6207736.jpeg')] ">
        <div className="h-full flex flex-col">
          <header>
            <h1 className="text-3xl ">Inspirational Quote</h1>
          </header>
          <input
            type="text"
            className="rounded-full p-2 outline-none text-sm shadow-md"
          />
        </div>
      </div>
    </div>
  );
}
