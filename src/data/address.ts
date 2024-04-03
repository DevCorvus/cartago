import { AddressDto, CreateUpdateAddressForm } from '@/shared/dtos/address.dto';

export const getAddresses = async () => {
  const res = await fetch('/api/addresses');

  if (!res.ok) {
    throw new Error('Could not get addresses');
  }

  return res.json();
};

export const createNewAddress = async (
  data: CreateUpdateAddressForm,
): Promise<AddressDto> => {
  const res = await fetch('/api/addresses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Could not create new address');
  }

  return res.json();
};

interface EditAddressInterface {
  addressId: string;
  data: CreateUpdateAddressForm;
}

export const editAddress = async ({
  addressId,
  data,
}: EditAddressInterface) => {
  const res = await fetch(`/api/addresses/${addressId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Could not update address');
  }

  return res.json();
};
