import { SubmitHandler, useForm } from 'react-hook-form';
import Modal from './Modal';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddressDto, CreateUpdateAddressForm } from '@/shared/dtos/address.dto';
import { createUpdateAddressFormSchema } from '@/shared/schemas/address.schema';
import { useEffect, useMemo, useState } from 'react';
import { CountryDto } from '@/shared/dtos/country.dto';
import Image from 'next/image';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi2';
import { useClickOutside } from '@/hooks/useClickOutside';
import LoadingModal from './LoadingModal';
import { EXCLUDED_COUNTRY_PHONES } from '@/utils/constants';
import { getCountryCodeFromPhoneNumber } from '@/lib/phone';
import { useCountries } from '@/data/country';
import { useUpdateAddress } from '@/data/address';
import { toastError } from '@/lib/toast';
import SubmitButton from './SubmitButton';
import { PhoneCodeInput } from './PhoneCodeInput';
import { CountryInput } from './CountryInput';

interface Props {
  address: AddressDto;
  updateAddress(data: AddressDto): void;
  close(): void;
}

export function EditAddressForm({ address, updateAddress, close }: Props) {
  const [showPhoneCodes, setShowPhoneCodes] = useState(false);
  const [selectedPhoneCountry, setSelectedPhoneCountry] =
    useState<CountryDto | null>(null);

  const { isLoading, isError, data: countries } = useCountries();

  useEffect(() => {
    if (isError) toastError();
  }, [isError]);

  const countryPhones = useMemo(() => {
    return countries
      .filter((country) => !EXCLUDED_COUNTRY_PHONES.includes(country.id))
      .toSorted((a, b) => {
        if (a.phoneCode > b.phoneCode) return 1;
        else if (a.phoneCode === b.phoneCode) return 0;
        else return -1;
      });
  }, [countries]);

  const phoneCodesRef = useClickOutside<HTMLButtonElement>(() =>
    setShowPhoneCodes(false),
  );

  const [showCountries, setShowCountries] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryDto | null>(
    null,
  );

  const countriesRef = useClickOutside<HTMLButtonElement>(() =>
    setShowCountries(false),
  );

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue,
    watch,
  } = useForm<CreateUpdateAddressForm>({
    resolver: zodResolver(createUpdateAddressFormSchema),
    defaultValues: {
      nickname: address.nickname,
      contactName: address.contactName,
      phoneNumber: address.phoneNumber.replace(/\+[0-9]+ /, ''),
      phoneCountryCode: getCountryCodeFromPhoneNumber(address.phoneNumber),
      countryId: address.country.id,
      stateId: address.state.id,
      city: address.city,
      postalCode: address.postalCode,
      street: address.street,
      streetDetails: address.streetDetails,
      default: address.default,
    },
  });

  useEffect(() => {
    if (countries) {
      const phoneCountryCode = getCountryCodeFromPhoneNumber(
        address.phoneNumber,
      )!;

      const phoneCountry =
        countries.find((country) => country.id === phoneCountryCode) || null;

      if (phoneCountry) {
        setSelectedPhoneCountry(phoneCountry);
        setValue('phoneCountryCode', phoneCountry.id);
      }

      const country =
        countries.find((country) => country.id === address.country.id) || null;

      if (country) {
        setSelectedCountry(country);
        setValue('countryId', country.id);
      }
    }
  }, [countries, setValue, address.country.id, address.phoneNumber]);

  const updateAddressMutation = useUpdateAddress();

  const onSubmit: SubmitHandler<CreateUpdateAddressForm> = async (data) => {
    try {
      const updatedAddress = await updateAddressMutation.mutateAsync({
        addressId: address.id,
        data,
      });
      updateAddress(updatedAddress);
      close();
    } catch (err) {
      toastError(err);
    }
  };

  const handleSelectCountryPhone = (country: CountryDto) => {
    setValue('phoneCountryCode', country.id, { shouldValidate: true });
    setSelectedPhoneCountry(country);
    setShowPhoneCodes(false);
  };

  const handleSelectCountry = (country: CountryDto) => {
    setValue('countryId', country.id, { shouldValidate: true });
    setValue('stateId', country.states[0].id, { shouldValidate: true });
    setSelectedCountry(country);
    setShowCountries(false);
  };

  const stateId = watch('stateId');

  if (isLoading) return <LoadingModal />;

  return (
    <Modal close={close}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid w-full grid-cols-2 gap-4 overflow-y-auto border-2 border-neutral-100 bg-white p-6 shadow-md lg:container sm:p-8 md:p-10 lg:gap-6 lg:rounded-lg lg:p-12"
      >
        <header className="col-span-full">
          <span className="text-xl font-bold text-cyan-700">
            Edit {address.nickname}
          </span>
        </header>
        <div className="col-span-2 space-y-2">
          <label htmlFor="nickname" className="text-slate-500">
            Nickname
          </label>
          <input
            {...register('nickname')}
            type="text"
            id="nickname"
            placeholder="Address nickname"
            className="input p-3"
          />
          {errors.nickname && (
            <p className="text-red-400">{errors.nickname.message}</p>
          )}
        </div>
        <div className="col-span-2 space-y-2 lg:col-span-1">
          <label htmlFor="contact-name" className="text-slate-500">
            Contact name
          </label>
          <input
            {...register('contactName')}
            type="text"
            id="contact-name"
            placeholder="Enter contact name"
            className="input p-3"
          />
          {errors.contactName && (
            <p className="text-red-400">{errors.contactName.message}</p>
          )}
        </div>
        <div className="col-span-2 space-y-2 lg:col-span-1">
          <label htmlFor="phone-number" className="text-slate-500">
            Phone number
          </label>
          <div className="relative w-full">
            <div className="input flex items-center gap-2 p-3 focus-within:border-cyan-500">
              <div>
                <button
                  ref={phoneCodesRef}
                  type="button"
                  className="flex items-center gap-1 text-sm"
                  onClick={() => setShowPhoneCodes((prev) => !prev)}
                >
                  <>
                    {selectedPhoneCountry && (
                      <Image
                        src={`https://flagcdn.com/${selectedPhoneCountry.id.toLowerCase()}.svg`}
                        alt={selectedPhoneCountry.name + ' Flag'}
                        width={0}
                        height={0}
                        className="h-auto w-6"
                      />
                    )}
                    {!showPhoneCodes ? <HiChevronDown /> : <HiChevronUp />}
                  </>
                </button>
              </div>
              <div className="flex-1">
                <input
                  {...register('phoneNumber')}
                  type="text"
                  id="phone-number"
                  placeholder="Enter phone number"
                  className="w-full bg-transparent"
                />
              </div>
            </div>
            {showPhoneCodes && (
              <PhoneCodeInput
                countryPhones={countryPhones}
                setPhoneCode={handleSelectCountryPhone}
              />
            )}
          </div>
          {errors.phoneNumber && (
            <p className="text-red-400">{errors.phoneNumber.message}</p>
          )}
        </div>
        <div className="relative col-span-2 space-y-2 lg:col-span-1">
          <label htmlFor="country" className="text-slate-500">
            Country
          </label>
          <button
            ref={countriesRef}
            type="button"
            className="input flex items-center justify-between p-3"
            onClick={() => setShowCountries((prev) => !prev)}
          >
            <>
              {selectedCountry ? (
                <div className="flex items-center gap-1">
                  <Image
                    src={`https://flagcdn.com/${selectedCountry.id.toLowerCase()}.svg`}
                    alt={selectedCountry.name + ' Flag'}
                    width={0}
                    height={0}
                    className="h-auto w-6"
                  />
                  <span className="line-clamp-1">{selectedCountry.name}</span>
                </div>
              ) : (
                <span>Select country</span>
              )}
              {!showCountries ? <HiChevronDown /> : <HiChevronUp />}
            </>
          </button>
          {showCountries && (
            <CountryInput
              countries={countries}
              setCountry={handleSelectCountry}
            />
          )}
          {errors.countryId && (
            <p className="text-red-400">{errors.countryId.message}</p>
          )}
        </div>
        <div className="col-span-2 space-y-2 lg:col-span-1">
          <label htmlFor="state" className="text-slate-500">
            State
          </label>
          <select
            {...register('stateId', { valueAsNumber: true })}
            id="state"
            className="input p-3"
            disabled={!selectedCountry}
            value={stateId}
          >
            <option value="" disabled>
              Select state
            </option>
            {selectedCountry && (
              <>
                {selectedCountry.states.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name || '(No state)'}
                  </option>
                ))}
              </>
            )}
          </select>
          {errors.stateId && (
            <p className="text-red-400">{errors.stateId.message}</p>
          )}
        </div>
        <div className="col-span-2 space-y-2 lg:col-span-1">
          <label htmlFor="city" className="text-slate-500">
            City
          </label>
          <input
            {...register('city')}
            type="text"
            id="city"
            placeholder="Enter city"
            className="input p-3"
          />
          {errors.city && <p className="text-red-400">{errors.city.message}</p>}
        </div>
        <div className="col-span-2 space-y-2 lg:col-span-1">
          <label htmlFor="postal-code" className="text-slate-500">
            Zip/Postal code
          </label>
          <input
            {...register('postalCode')}
            type="text"
            id="postal-code"
            placeholder="Enter zip/postal code if available"
            className="input p-3"
          />
          {errors.postalCode && (
            <p className="text-red-400">{errors.postalCode.message}</p>
          )}
        </div>
        <div className="col-span-2 space-y-2">
          <label htmlFor="street" className="text-slate-500">
            Street
          </label>
          <input
            {...register('street')}
            type="text"
            id="street"
            placeholder="Street address"
            className="input p-3"
          />
          {errors.street && (
            <p className="text-red-400">{errors.street.message}</p>
          )}
        </div>
        <div className="col-span-2 space-y-2">
          <label hidden htmlFor="street-details" className="text-slate-500">
            Street details
          </label>
          <input
            {...register('streetDetails')}
            type="text"
            id="street-details"
            placeholder="Apartment, suite, etc. (Optional)"
            className="input p-3"
          />
          {errors.streetDetails && (
            <p className="text-red-400">{errors.streetDetails.message}</p>
          )}
        </div>
        <div className="col-span-2 mt-2 flex items-center gap-2">
          <input
            {...register('default')}
            type="checkbox"
            id="default"
            className="size-4 bg-slate-50 accent-cyan-600"
          />
          <label htmlFor="default" className="text-slate-500">
            Set as default
          </label>
        </div>
        <div className="col-span-2 mt-4 flex items-center gap-2">
          <SubmitButton
            className="px-5 py-2"
            disabled={isSubmitting}
            placeholder="Updating"
          >
            Update
          </SubmitButton>
          <button
            type="button"
            onClick={close}
            className="btn-alternative px-5 py-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
