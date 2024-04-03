'use client';

import { useEffect, useState } from 'react';
import { HiMiniPlus } from 'react-icons/hi2';
import { AddAddressForm } from './AddAddressForm';
import { AddressDto } from '@/shared/dtos/address.dto';
import Loading from './Loading';
import AddressItem from './AddressItem';
import { useQuery } from '@tanstack/react-query';
import SomethingWentWrong from './SomethingWentWrong';
import { getAddresses } from '@/data/address';

export function AddressList() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [addresses, setAddresses] = useState<AddressDto[]>([]);

  const { isLoading, isError, data } = useQuery({
    queryFn: getAddresses,
    queryKey: ['addresses'],
  });

  useEffect(() => {
    if (data) {
      setAddresses(data);
    }
  }, [data]);

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

  const updateAddress = (data: AddressDto) => {
    setAddresses((prev) => {
      if (data.default) {
        prev = prev.map((address) => {
          address.default = false;
          return address;
        });
      }

      return prev.map((address) => {
        if (address.id === data.id) {
          return data;
        }
        return address;
      });
    });
  };

  const removeAddress = (addressId: string) => {
    setAddresses((prev) => prev.filter((address) => address.id !== addressId));
  };

  if (isLoading) return <Loading />;
  if (isError) return <SomethingWentWrong />;

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-green-800">Addresses</h1>
      </header>
      <div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-transparent border-t-gray-100 bg-white p-3 font-semibold text-green-800 shadow-md transition hover:border-green-700 focus:border-green-700"
        >
          <HiMiniPlus className="text-3xl" />
          Add address
        </button>
      </div>
      <ul className="space-y-4">
        {addresses.map((address) => (
          <li key={address.id}>
            <AddressItem
              address={address}
              updateAddress={updateAddress}
              removeAddress={removeAddress}
            />
          </li>
        ))}
      </ul>
      {showAddForm && (
        <AddAddressForm
          addAddress={addAddress}
          close={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}
