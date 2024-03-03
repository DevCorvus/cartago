import { z } from 'zod';
import {
  createUpdateAddressFormSchema,
  createUpdateAddressSchema,
} from '../schemas/address.schema';

export type CreateUpdateAddressForm = z.infer<
  typeof createUpdateAddressFormSchema
>;
export type CreateUpdateAddressDto = z.infer<typeof createUpdateAddressSchema>;

export interface AddressDto {
  id: string;
  nickname: string;
  contactName: string;
  phoneNumber: string;
  city: string;
  postalCode: string;
  street: string;
  streetDetails: string;
  createdAt: Date;
  updatedAt: Date;
  default: boolean;
  state: {
    id: number;
    name: string;
  };
  country: {
    id: string;
    name: string;
  };
}

export interface AddressMinimalDto {
  id: string;
  nickname: string;
  default: boolean;
}
