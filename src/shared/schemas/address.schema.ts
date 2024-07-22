import { isValidPhoneNumber } from '@/lib/phone';
import { z } from 'zod';

const countryCodeSchema = z.string().length(2).trim();

export const createUpdateAddressSchema = z.object({
  stateId: z.number().int().positive(),
  nickname: z.string().trim().min(1),
  contactName: z.string().trim().min(4),
  phoneNumber: z.string().trim(),
  city: z.string().trim().min(1),
  postalCode: z.string().trim(),
  street: z.string().trim().min(1),
  streetDetails: z.string().trim(),
  default: z.boolean(),
});

export const createUpdateAddressFormSchema = createUpdateAddressSchema
  .extend({
    countryId: countryCodeSchema,
    phoneCountryCode: countryCodeSchema,
  })
  .refine(
    (data) => isValidPhoneNumber(data.phoneNumber, data.phoneCountryCode),
    {
      message: 'Invalid phone number',
      path: ['phoneNumber'],
    },
  );
