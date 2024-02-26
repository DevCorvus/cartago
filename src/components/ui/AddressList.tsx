'use client';

import { useState } from 'react';
import { HiMiniPlus } from 'react-icons/hi2';
import { AddAddressForm } from './AddAddressForm';

export function AddressList() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <header>
        <h1 className="text-green-800 font-bold text-2xl">Addresses</h1>
      </header>
      <button
        onClick={() => setShowForm(true)}
        className="px-5 py-3 flex items-center gap-2 btn rounded-md"
      >
        <HiMiniPlus className="text-2xl" />
        New address
      </button>
      {showForm && <AddAddressForm close={() => setShowForm(false)} />}
    </div>
  );
}
