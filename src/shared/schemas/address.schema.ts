import { isValidPhoneNumber } from '@/lib/phone';
import { z } from 'zod';

const countryCodeSchema = z.string().length(2).trim();

export const createUpdateAddressSchema = z.object({
  stateId: z.number().int().positive(),
  nickname: z.string().nonempty().trim(),
  contactName: z.string().min(4).trim(),
  phoneNumber: z.string().trim(),
  city: z.string().nonempty().trim(),
  postalCode: z.string().trim(),
  street: z.string().nonempty().trim(),
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
