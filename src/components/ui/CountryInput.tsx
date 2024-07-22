import { CountryDto } from '@/shared/dtos/country.dto';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

interface Props {
  countries: CountryDto[];
  setCountry(country: CountryDto): void;
}

export function CountryInput({ countries, setCountry }: Props) {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const ul = ref.current;
    if (ul) ul.focus();
  }, []);

  useEffect(() => {
    const ul = ref.current;

    const handleKeydown = (e: KeyboardEvent) => {
      if (ul) {
        for (const li of Array.from(ul.children) as HTMLLIElement[]) {
          const name = li.dataset.name;

          if (name && name.toLowerCase().startsWith(e.key.toLowerCase())) {
            (li.firstChild as HTMLButtonElement).focus();
            return ul.scrollTo({ top: li.offsetTop });
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  });

  return (
    <ul
      tabIndex={0}
      ref={ref}
      className="absolute top-20 z-10 h-80 w-full overflow-y-auto rounded-lg bg-slate-50 p-2 shadow-md"
    >
      {countries.map((country) => (
        <li key={country.id} data-name={country.name}>
          <button
            type="button"
            className="flex w-full items-center gap-1 py-1 text-sm transition hover:text-cyan-600 focus:text-cyan-600"
            onClick={() => setCountry(country)}
          >
            <Image
              src={`https://flagcdn.com/${country.id.toLowerCase()}.svg`}
              alt={country.name + ' Flag'}
              width={0}
              height={0}
              className="h-auto w-6"
            />
            <span className="line-clamp-1 text-left">{country.name}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
