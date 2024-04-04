import {
  AddressDto,
  AddressMinimalDto,
  CreateUpdateAddressForm,
} from '@/shared/dtos/address.dto';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useAddresses = () => {
  return useQuery<AddressDto[]>({
    queryFn: async () => {
      const res = await fetch('/api/addresses');

      if (!res.ok) {
        throw new Error('Could not get addresses');
      }

      return res.json();
    },
    queryKey: ['addresses'],
  });
};

export const useMinimalAddresses = () => {
  return useQuery<AddressMinimalDto[]>({
    queryFn: async () => {
      const res = await fetch('/api/addresses?minimal=true');

      if (!res.ok) {
        throw new Error('Could not get minimal addresses');
      }

      return res.json();
    },
    queryKey: ['minimalAddresses'],
  });
};

export const useCreateAddress = () => {
  return useMutation({
    mutationFn: async (data: CreateUpdateAddressForm): Promise<AddressDto> => {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Could not create new address');
      }

      return res.json();
    },
    mutationKey: ['createAddress'],
  });
};

interface EditAddressInterface {
  addressId: string;
  data: CreateUpdateAddressForm;
}

export const useUpdateAddress = () => {
  return useMutation({
    mutationFn: async ({
      addressId,
      data,
    }: EditAddressInterface): Promise<AddressDto> => {
      const res = await fetch(`/api/addresses/${addressId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Could not update address');
      }

      return res.json();
    },
    mutationKey: ['editAddress'],
  });
};

export const useDeleteAddress = () => {
  return useMutation({
    mutationFn: async (addressId: string): Promise<void> => {
      const res = await fetch(`/api/addresses/${addressId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Could not delete address');
      }
    },
    mutationKey: ['deleteAddress'],
  });
};
