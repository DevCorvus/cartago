import { CountryDto } from '@/shared/dtos/country.dto';

export const getCountries = async (): Promise<CountryDto[]> => {
  const res = await fetch('/api/countries');

  if (!res.ok) {
    throw new Error('Could not get countries');
  }

  return res.json();
};
