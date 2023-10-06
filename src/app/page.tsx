'use client';

import Image from 'next/image';
import { useSession } from 'next-auth/react';

export default function Home() {
  const session = useSession();

  if (session.status === 'authenticated') {
    console.log(session.data);
  }

  return (
    <div className="h-full text-slate-100">
      <div className="h-full flex flex-col items-center justify-center gap-5 bg-cover">
        <div className="flex flex-col gap-6">
          <header>
            <h1 className="font-black text-[2.5rem] shadow-slate-700 [text-shadow:0_2px_2px_var(--tw-shadow-color)]">
              Inspirational Quote
            </h1>
          </header>
          <input
            type="text"
            className="rounded-full p-2 outline-none text-sm shadow-md"
          />
        </div>
      </div>
      <div className="absolute inset-0 -z-10">
        <div className="relative w-full h-full">
          <Image
            src="/background-tiny.jpeg"
            alt="Hero Image"
            layout="fill"
            objectFit="cover"
            className="grayscale-[40%]"
          />
          <div className="bg-green-700 opacity-10 absolute inset-0"></div>
        </div>
      </div>
    </div>
  );
}
