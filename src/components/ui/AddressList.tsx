'use client';

import { useEffect, useState } from 'react';
import { HiMiniCheckCircle, HiMiniPhone, HiMiniPlus } from 'react-icons/hi2';
import { AddAddressForm } from './AddAddressForm';
import { AddressDto } from '@/shared/dtos/address.dto';
import Loading from './Loading';
import Image from 'next/image';

export function AddressList() {
  const [addresses, setAddresses] = useState<AddressDto[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/addresses');

      if (res.ok) {
        const data: AddressDto[] = await res.json();
        setAddresses(data);
      }

      setLoading(false);
    })();
  }, []);

  const addAddress = (newAddress: AddressDto) => {
    setAddresses((prev) => {
      if (newAddress.default) {
        prev = prev.map((address) => {
          address.default = false;
          return address;
        });
      }
      return [newAddress, ...prev];
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="w-full max-w-md flex flex-col gap-6">
      <header>
        <h1 className="text-green-800 font-bold text-2xl">Addresses</h1>
      </header>
      <div>
        <button
          onClick={() => setShowForm(true)}
          className="w-full border border-transparent border-t-gray-100 hover:border-green-700 focus:border-green-700 transition p-3 rounded-full shadow-md bg-white text-green-800 font-semibold flex items-center justify-center gap-2"
        >
          <HiMiniPlus className="text-3xl" />
          Add address
        </button>
      </div>
      <ul className="space-y-4">
        {addresses.map((address) => (
          <li key={address.id}>
            <div
              className={`grid grid-cols-2 gap-2 bg-white p-8 rounded-md shadow-md border-2 border-gray-50 ring ${
                address.default ? 'ring-green-700' : 'ring-transparent'
              }`}
            >
              {address.default && (
                <p className="col-span-2 text-green-800 flex items-center gap-1 mb-4">
                  <HiMiniCheckCircle /> This is your default address
                </p>
              )}
              <div className="space-y-1 col-span-2">
                <span className="text-green-800 opacity-75">
                  Address nickname
                </span>
                <p>{address.nickname}</p>
              </div>
              <div className="space-y-1">
                <span className="text-green-800 opacity-75">Contact name</span>
                <p>{address.contactName}</p>
              </div>
              <div className="space-y-1">
                <span className="text-green-800 opacity-75">Phone number</span>
                <p className="flex items-center gap-1">
                  <HiMiniPhone /> {address.phoneNumber}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-green-800 opacity-75">Country</span>
                <p className="flex items-center gap-1">
                  <Image
                    src={`https://flagcdn.com/${address.country.id.toLowerCase()}.svg`}
                    alt={address.country.name + ' Flag'}
                    width={0}
                    height={0}
                    className="w-5 h-auto"
                  />
                  {address.country.name}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-green-800 opacity-75">State</span>
                {address.state.name ? (
                  <p>{address.state.name}</p>
                ) : (
                  <p className="italic text-slate-400">No state</p>
                )}
              </div>
              <div className="space-y-1">
                <span className="text-green-800 opacity-75">City</span>
                <p>{address.city}</p>
              </div>
              <div className="space-y-1">
                <span className="text-green-800 opacity-75">
                  Zip/Postal code
                </span>
                {address.postalCode ? (
                  <p>{address.postalCode}</p>
                ) : (
                  <p className="italic text-slate-400">No postal code</p>
                )}
              </div>
              <div className="space-y-1 col-span-2">
                <span className="text-green-800 opacity-75">Street</span>
                <p>{address.street}</p>
                {address.streetDetails ? (
                  <p>{address.streetDetails}</p>
                ) : (
                  <p className="italic text-slate-400">No more details</p>
                )}
              </div>
              <div className="space-y-1">
                <span className="text-green-800 opacity-75">Created at</span>
                <p>{new Date(address.createdAt).toDateString()}</p>
              </div>
              <div className="space-y-1">
                <span className="text-green-800 opacity-75">Last update</span>
                <p>{new Date(address.updatedAt).toDateString()}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {showForm && (
        <AddAddressForm
          addAddress={addAddress}
          close={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
