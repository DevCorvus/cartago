import { CountryDto } from '@/shared/dtos/country.dto';
import { useQuery } from '@tanstack/react-query';

export const useCountries = () => {
  return useQuery<CountryDto[]>({
    initialData: [],
    queryFn: async () => {
      const res = await fetch('/api/countries');

      if (!res.ok) {
        throw new Error('Could not get countries');
      }

      return res.json();
    },
    queryKey: ['countries'],
  });
};
