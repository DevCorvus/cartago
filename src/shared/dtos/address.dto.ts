import { z } from 'zod';
import {
  createAddressFormSchema,
  createAddressSchema,
} from '../schemas/address.schema';

export type CreateAddressForm = z.infer<typeof createAddressFormSchema>;
export type CreateAddressDto = z.infer<typeof createAddressSchema>;

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
    name: string;
  };
  country: {
    id: string;
    name: string;
  };
}
