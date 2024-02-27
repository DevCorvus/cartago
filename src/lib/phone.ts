import {
  CountryCode,
  isValidPhoneNumber as isValid,
  parsePhoneNumber,
} from 'libphonenumber-js';

export function isValidPhoneNumber(input: string, countryCode: string) {
  return isValid(input, countryCode as CountryCode);
}

export function formatPhoneNumber(input: string, countryCode: string) {
  return parsePhoneNumber(
    input,
    countryCode as CountryCode,
  ).formatInternational();
}
