'use client';

import { useEffect, useState } from 'react';
import { HiMiniPlus } from 'react-icons/hi2';
import { AddAddressForm } from './AddAddressForm';
import { AddressDto } from '@/shared/dtos/address.dto';
import Loading from './Loading';
import AddressItem from './AddressItem';
import SomethingWentWrong from './SomethingWentWrong';
import { useAddresses } from '@/data/address';

export function AddressList() {
  const [showForm, setShowForm] = useState(false);
  const [addresses, setAddresses] = useState<AddressDto[]>([]);

  const { isLoading, isError, data } = useAddresses();

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
    <div className="w-full max-w-md space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-cyan-700">Addresses</h1>
      </header>
      {addresses.length > 0 ? (
        <section className="space-y-6">
          <button
            onClick={() => setShowForm(true)}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-neutral-100 bg-white p-3 font-semibold text-cyan-600 shadow-sm transition hover:text-cyan-500 hover:shadow-md focus:text-cyan-500 focus:shadow-md"
          >
            <HiMiniPlus className="text-3xl" />
            Add address
          </button>
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
        </section>
      ) : (
        <section className="justify-center space-y-4 rounded-lg bg-white px-20 py-12 text-slate-700 shadow-inner shadow-slate-300">
          <p className="text-center">
            You do not have any addresses yet, would you like to add one?
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="btn mx-auto flex items-center gap-1 px-3 py-2"
          >
            <HiMiniPlus className="text-2xl" />
            New
          </button>
        </section>
      )}
      {showForm && (
        <AddAddressForm
          addAddress={addAddress}
          close={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
