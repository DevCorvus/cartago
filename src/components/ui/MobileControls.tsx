'use client';

import { useState } from 'react';
import { HiMiniMagnifyingGlass } from 'react-icons/hi2';
import MobileSearchForm from './MobileSearchForm';
import { useClickOutside } from '@/hooks/useClickOutside';

export default function MobileControls() {
  const [showSearchForm, setShowSearchForm] = useState(false);

  const ref = useClickOutside<HTMLDivElement>(() => setShowSearchForm(false));

  return (
    <div ref={ref} className="fixed bottom-0 left-0 z-30 w-full p-4 md:hidden">
      <div className="container mx-auto">
        <div className={showSearchForm ? '' : 'hidden'}>
          <MobileSearchForm visible={showSearchForm} />
        </div>
        <button
          onClick={() => setShowSearchForm(true)}
          className={`${showSearchForm ? 'hidden' : ''} shadow-m rounded-full border border-slate-200 bg-white p-2.5 text-xl text-cyan-700 transition hover:text-cyan-500 focus:text-cyan-500`}
        >
          <HiMiniMagnifyingGlass />
        </button>
      </div>
    </div>
  );
}
