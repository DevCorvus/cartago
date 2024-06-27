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
    <div
      ref={ref}
      className={`fixed ${showBtn ? 'bottom-4 left-4' : 'bottom-4 left-0 w-full px-4'} z-30 md:hidden`}
    >
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
