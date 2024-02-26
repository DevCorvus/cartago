import { z } from 'zod';
import { isValidPhoneNumber, CountryCode } from 'libphonenumber-js';

const countryCodeSchema = z.string().length(2).trim();

export const createAddressSchema = z.object({
  stateId: z.number().int().positive(),
  contactName: z.string().min(4).trim(),
  phoneCode: z.string().nonempty().trim(),
  phoneNumber: z.string().trim(),
  city: z.string().nonempty().trim(),
  postalCode: z.string().trim(),
  street: z.string().nonempty().trim(),
  streetDetails: z.string().trim(),
  default: z.boolean(),
});

export const createAddressFormSchema = createAddressSchema
  .extend({
    countryId: countryCodeSchema,
    phoneCountryCode: countryCodeSchema,
  })
  .refine(
    (data) =>
      isValidPhoneNumber(
        data.phoneNumber,
        data.phoneCountryCode as CountryCode,
      ),
    {
      message: 'Invalid phone number',
      path: ['phoneNumber'],
    },
  );
