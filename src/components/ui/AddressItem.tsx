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
import { useDeleteAddress } from '@/data/address';
import { toastError } from '@/lib/toast';
import ConfirmModal from './ConfirmModal';

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

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const menuRef = useClickOutside<HTMLDivElement>(() => setShowActions(false));

  const deleteAddressMutation = useDeleteAddress();

  const handleDelete = async (addressId: string) => {
    try {
      await deleteAddressMutation.mutateAsync(addressId);
      removeAddress(addressId);
    } catch (err) {
      toastError(err);
    }
  };

  return (
    <>
      <div
        className={
          'grid grid-cols-2 gap-4 rounded-lg border-2 border-slate-100 bg-white p-8 text-slate-700 shadow-md'
        }
      >
        {address.default && (
          <p className="col-span-2 mb-4 flex items-center gap-1 font-medium text-cyan-700">
            <HiMiniCheckCircle className="text-xl" /> This is your default
            address
          </p>
        )}
        <div className="col-span-2 flex justify-between">
          <div className="flex-1 space-y-1">
            <span className="text-slate-400">Address nickname</span>
            <p>{address.nickname}</p>
          </div>
          <div className="relative flex items-center gap-2 self-start">
            <button
              title="Toggle actions menu"
              className="text-2xl text-slate-500 transition hover:text-slate-700"
              onClick={() => setShowActions((prev) => !prev)}
            >
              {showActions ? <HiXMark /> : <HiEllipsisHorizontal />}
            </button>
            {showActions && (
              <div
                ref={menuRef}
                className="absolute -right-2 top-7 z-10 flex flex-col gap-3 rounded-lg bg-slate-50 p-3 text-slate-600 shadow-md"
              >
                <button
                  title="Edit address"
                  className="transition hover:text-green-500 focus:text-green-500"
                  onClick={() => setShowEditForm(true)}
                >
                  <HiPencil />
                </button>
                <button
                  title="Delete address"
                  className="transition hover:text-rose-400 focus:text-rose-400"
                  onClick={() => setShowDeleteConfirmation(true)}
                >
                  <HiTrash />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="col-span-2 space-y-1 sm:col-span-1">
          <span className="text-slate-400">Contact name</span>
          <p>{address.contactName}</p>
        </div>
        <div className="col-span-2 space-y-1 sm:col-span-1">
          <span className="text-slate-400">Phone number</span>
          <p className="flex items-center gap-1">
            <HiMiniPhone /> {address.phoneNumber}
          </p>
        </div>
        <div className="col-span-2 space-y-1 sm:col-span-1">
          <span className="text-slate-500">Country</span>
          <p className="flex items-center gap-1">
            <Image
              src={`https://flagcdn.com/${address.country.id.toLowerCase()}.svg`}
              alt={address.country.name + ' Flag'}
              width={0}
              height={0}
              className="h-auto w-5"
            />
            {address.country.name}
          </p>
        </div>
        <div className="col-span-2 space-y-1 sm:col-span-1">
          <span className="text-slate-400">State</span>
          {address.state.name ? (
            <p>{address.state.name}</p>
          ) : (
            <p className="italic">No state</p>
          )}
        </div>
        <div className="col-span-2 space-y-1 sm:col-span-1">
          <span className="text-slate-400">City</span>
          <p>{address.city}</p>
        </div>
        <div className="col-span-2 space-y-1 sm:col-span-1">
          <span className="text-slate-400">Zip/Postal code</span>
          {address.postalCode ? (
            <p>{address.postalCode}</p>
          ) : (
            <p className="italic text-slate-400">No postal code</p>
          )}
        </div>
        <div className="col-span-2 space-y-1">
          <span className="text-slate-400">Street</span>
          <p>{address.street}</p>
          {address.streetDetails ? (
            <p>{address.streetDetails}</p>
          ) : (
            <p className="italic">No more details</p>
          )}
        </div>
        <div className="col-span-2 space-y-1 sm:col-span-1">
          <span className="text-slate-400">Created at</span>
          <p>{new Date(address.createdAt).toDateString()}</p>
        </div>
        <div className="col-span-2 space-y-1 sm:col-span-1">
          <span className="text-slate-400">Last update</span>
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
      {showDeleteConfirmation && (
        <ConfirmModal
          action={() => handleDelete(address.id)}
          close={() => setShowDeleteConfirmation(false)}
        />
      )}
    </>
  );
}
