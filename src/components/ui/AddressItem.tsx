import { AddressDto } from '@/shared/dtos/address.dto';
import Image from 'next/image';
import { useState } from 'react';
import {
  HiEllipsisHorizontal,
  HiMiniCheckCircle,
  HiMiniPhone,
  HiPencil,
  HiTrash,
  HiXMark,
} from 'react-icons/hi2';
import { EditAddressForm } from './EditAddressForm';
import { useClickOutside } from '@/hooks/useClickOutside';

interface Props {
  address: AddressDto;
  updateAddress(data: AddressDto): void;
  removeAddress(id: string): void;
}

export default function AddressItem({
  address,
  updateAddress,
  removeAddress,
}: Props) {
  const [showActions, setShowActions] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const menuRef = useClickOutside<HTMLDivElement>(() => setShowActions(false));

  const handleDelete = async (addressId: string) => {
    const res = await fetch(`/api/addresses/${addressId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      removeAddress(addressId);
    }
  };

  return (
    <>
      <div
        className={`grid grid-cols-2 gap-4 bg-white p-8 rounded-md shadow-md border-2 border-gray-50 ring ${
          address.default ? 'ring-green-700' : 'ring-transparent'
        }`}
      >
        {address.default && (
          <p className="col-span-2 text-green-800 flex items-center gap-1 mb-4">
            <HiMiniCheckCircle /> This is your default address
          </p>
        )}
        <div className="col-span-2 flex justify-between">
          <div className="space-y-1 flex-1">
            <span className="text-green-800 opacity-75">Address nickname</span>
            <p>{address.nickname}</p>
          </div>
          <div className="relative self-start flex items-center gap-2">
            <button
              title="Toggle actions menu"
              className="text-2xl text-slate-500 hover:text-slate-700 transition"
              onClick={() => setShowActions((prev) => !prev)}
            >
              {showActions ? <HiXMark /> : <HiEllipsisHorizontal />}
            </button>
            {showActions && (
              <div
                ref={menuRef}
                className="absolute z-10 top-7 -right-2 bg-slate-50 shadow-md rounded-md p-3 text-slate-700 flex flex-col gap-3"
              >
                <button
                  title="Edit address"
                  className="hover:text-green-700 focus:text-green-700 transition"
                  onClick={() => setShowEditForm(true)}
                >
                  <HiPencil />
                </button>
                <button
                  type="submit"
                  title="Delete address"
                  className="hover:text-red-600 focus:text-red-600 transition"
                  onClick={() => handleDelete(address.id)}
                >
                  <HiTrash />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-1 col-span-2 sm:col-span-1">
          <span className="text-green-800 opacity-75">Contact name</span>
          <p>{address.contactName}</p>
        </div>
        <div className="space-y-1 col-span-2 sm:col-span-1">
          <span className="text-green-800 opacity-75">Phone number</span>
          <p className="flex items-center gap-1">
            <HiMiniPhone /> {address.phoneNumber}
          </p>
        </div>
        <div className="space-y-1 col-span-2 sm:col-span-1">
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
        <div className="space-y-1 col-span-2 sm:col-span-1">
          <span className="text-green-800 opacity-75">State</span>
          {address.state.name ? (
            <p>{address.state.name}</p>
          ) : (
            <p className="italic text-slate-400">No state</p>
          )}
        </div>
        <div className="space-y-1 col-span-2 sm:col-span-1">
          <span className="text-green-800 opacity-75">City</span>
          <p>{address.city}</p>
        </div>
        <div className="space-y-1 col-span-2 sm:col-span-1">
          <span className="text-green-800 opacity-75">Zip/Postal code</span>
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
        <div className="space-y-1 col-span-2 sm:col-span-1">
          <span className="text-green-800 opacity-75">Created at</span>
          <p>{new Date(address.createdAt).toDateString()}</p>
        </div>
        <div className="space-y-1 col-span-2 sm:col-span-1">
          <span className="text-green-800 opacity-75">Last update</span>
          <p>{new Date(address.updatedAt).toDateString()}</p>
        </div>
      </div>
      {showEditForm && (
        <EditAddressForm
          address={address}
          updateAddress={updateAddress}
          close={() => setShowEditForm(false)}
        />
      )}
    </>
  );
}
