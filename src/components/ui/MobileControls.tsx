'use client';

import { useState } from 'react';
import { HiMiniMagnifyingGlass } from 'react-icons/hi2';
import MobileSearchForm from './MobileSearchForm';
import { useClickOutside } from '@/hooks/useClickOutside';

export default function MobileControls() {
  const [showBtn, setShowBtn] = useState(true);
  const [showSearchForm, setShowSearchForm] = useState(false);

  const ref = useClickOutside<HTMLDivElement>(() => setShowSearchForm(false));

  const handleClick = () => {
    setShowBtn(false);
    setShowSearchForm(true);
  };

  return (
    <div ref={ref} className="fixed bottom-0 left-0 z-30 w-full p-4 md:hidden">
      <div className="container mx-auto">
        <div className={showBtn ? 'hidden' : ''}>
          <MobileSearchForm
            visible={showSearchForm}
            hide={() => setShowBtn(true)}
          />
        </div>
        <button
          onClick={handleClick}
          className={`${showBtn ? '' : 'hidden'} shadow-m rounded-full border border-slate-200 bg-white p-2.5 text-xl text-cyan-700 transition hover:text-cyan-500 focus:text-cyan-500`}
        >
          <HiMiniMagnifyingGlass />
        </button>
      </div>
    </div>
  );
}
