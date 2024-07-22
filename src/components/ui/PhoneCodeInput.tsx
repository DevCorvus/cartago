import { CountryDto } from '@/shared/dtos/country.dto';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

interface Props {
  countryPhones: CountryDto[];
  setPhoneCode(country: CountryDto): void;
}

export function PhoneCodeInput({ countryPhones, setPhoneCode }: Props) {
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
          const phoneCode = li.dataset.phonecode;

          if (phoneCode && phoneCode.startsWith(e.key)) {
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
      className="absolute left-0 top-14 z-10 h-80 w-32 overflow-y-auto rounded-lg bg-slate-50 p-2 shadow-md"
    >
      {countryPhones.map((country) => (
        <li key={country.id} data-phonecode={country.phoneCode}>
          <button
            type="button"
            className="flex w-full items-center gap-1 py-1 text-sm transition hover:text-cyan-600 focus:text-cyan-600"
            onClick={() => setPhoneCode(country)}
          >
            <Image
              src={`https://flagcdn.com/${country.id.toLowerCase()}.svg`}
              alt={country.name + ' Flag'}
              width={0}
              height={0}
              className="h-auto w-6"
            />
            <span className="line-clamp-1">+{country.phoneCode}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
