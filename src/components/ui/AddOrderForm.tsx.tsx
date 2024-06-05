'use client';

import { CheckoutOrderDto } from '@/shared/dtos/order.dto';
import { HiOutlineQuestionMarkCircle, HiPlus } from 'react-icons/hi2';
import Image from 'next/image';
import { formatMoney } from '@/lib/dinero';
import { CreatePaymentDto } from '@/shared/dtos/payment.dto';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPaymentSchema } from '@/shared/schemas/payment.schema';
import { formatDate } from '@/utils/formatDate';
import OrderStatusTag from './OrderStatusTag';
import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { AddressDto, AddressMinimalDto } from '@/shared/dtos/address.dto';
import { AddAddressForm } from './AddAddressForm';
import { useMinimalAddresses } from '@/data/address';
import { usePayment } from '@/data/order';
import { toastError } from '@/lib/toast';
import Loading from './Loading';
import SubmitButton from './SubmitButton';

interface Props {
  order: CheckoutOrderDto;
}

export default function AddOrderForm({ order }: Props) {
  const router = useRouter();
  const [addresses, setAddresses] = useState<AddressMinimalDto[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const { isLoading, isError, data } = useMinimalAddresses();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<CreatePaymentDto>({
    resolver: zodResolver(createPaymentSchema),
  });

  useEffect(() => {
    if (data) {
      setAddresses(data);
      setValue('address', data.find((address) => address.default)?.id || '');
    }
  }, [data, setValue]);

  useEffect(() => {
    if (isError) toastError();
  }, [isError]);

  const addAddress = (newAddress: AddressDto) => {
    setAddresses((prev) => {
      if (newAddress.default) {
        prev = prev.map((address) => {
          address.default = false;
          return address;
        });
      }
      return [
        ...prev,
        {
          id: newAddress.id,
          nickname: newAddress.nickname,
          default: newAddress.default,
        },
      ];
    });
    setTimeout(() => {
      setValue('address', newAddress.id);
    }, 100);
  };

  const paymentMutation = usePayment();

  const onSubmit: SubmitHandler<CreatePaymentDto> = async (data) => {
    try {
      await paymentMutation.mutateAsync({ orderId: order.id, data });
      router.push(`/account/orders/${order.id}`);
    } catch (err) {
      toastError(err);
    }
  };

  const submitWrapper = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (showAddressForm) return;

    const cb = handleSubmit(onSubmit);
    await cb(e);
  };

  if (isLoading) return <Loading />;

  return (
    <form
      onSubmit={submitWrapper}
      className="w-full max-w-md space-y-10 rounded-lg bg-white p-8 text-slate-700 shadow-md"
    >
      <div className="space-y-10">
        <header className="text-2xl font-bold text-cyan-700">
          <h1 className="flex items-center justify-between gap-2">
            Placing order
            <OrderStatusTag status={order.status} className="text-lg" />
          </h1>
        </header>
        <section className="text-sm">
          <table>
            <tbody>
              <tr>
                <th className="px-2 py-0.5 text-left">ID</th>
                <td>
                  <span className="rounded-md bg-slate-50 px-1 py-0.5 shadow-sm">
                    {order.id}
                  </span>
                </td>
              </tr>
              <tr>
                <th className="px-2 py-0.5 text-left">Date</th>
                <td>
                  <p className="flex items-center gap-1 px-1 py-0.5">
                    <span>{formatDate(new Date(order.createdAt))}</span>
                    <HiOutlineQuestionMarkCircle
                      className="text-cyan-700"
                      title="MM/DD/YYYY"
                    />
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
        <section className="space-y-2">
          <header className="flex items-center justify-between text-lg font-semibold text-cyan-700">
            <h2>Shipping address</h2>
            <div>
              <button
                onClick={() => setShowAddressForm(true)}
                title="Add new address"
                type="button"
                className="rounded-md border border-cyan-600 p-0.5 text-cyan-600 shadow-sm transition hover:border-cyan-500 hover:bg-cyan-500 hover:text-slate-50 hover:shadow-md focus:border-cyan-500 focus:bg-cyan-500 focus:text-slate-50 focus:shadow-md"
              >
                <HiPlus className="text-base" />
              </button>
            </div>
          </header>
          <div>
            <div className="flex gap-2">
              <select className="input p-3" {...register('address')}>
                <option value="" disabled>
                  Select address
                </option>
                {addresses.map((address) => (
                  <option key={address.id} value={address.id}>
                    {address.nickname + (address.default ? ' (Default)' : '')}
                  </option>
                ))}
              </select>
            </div>
            {errors.address && (
              <p className="text-red-400">{errors.address.message}</p>
            )}
          </div>
        </section>
        <section className="space-y-2">
          <header className="text-lg font-semibold text-cyan-700">
            <h2>Payment method</h2>
          </header>
          <div>
            <select
              className="input p-3"
              {...register('method')}
              defaultValue=""
            >
              <option value="" disabled>
                Select payment method
              </option>
              <option value="BISON">BISON</option>
              <option value="HUMBLECARD">HumbleCard</option>
              <option value="PAYMATE">PayMate</option>
            </select>
            {errors.method && (
              <p className="text-red-400">{errors.method.message}</p>
            )}
          </div>
        </section>
        <section className="space-y-2">
          <header className="text-lg font-semibold text-cyan-700">
            <h2>Items</h2>
          </header>
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex gap-2 rounded-md bg-slate-50/75 shadow-md"
            >
              <Link
                href={`/items/${item.id}`}
                className="relative h-20 w-20 rounded-l-md bg-neutral-100"
              >
                <Image
                  src={'/images/' + item.image.path}
                  alt={item.title}
                  fill={true}
                  sizes="100px"
                  className="rounded-md object-contain"
                />
              </Link>
              <section className="flex flex-1 flex-col justify-around p-1">
                <div>
                  <p>{item.title}</p>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <p>
                    <span className="text-slate-500">Amount</span>{' '}
                    <span className="rounded-xl bg-slate-100 px-1 font-medium text-slate-600 shadow-sm">
                      {item.amount}
                    </span>
                  </p>
                  <p>
                    <span className="text-slate-500">Price</span>{' '}
                    <span className="rounded-xl bg-slate-100 px-1 font-medium text-slate-600 shadow-sm">
                      {formatMoney(item.price)}
                    </span>
                  </p>
                </div>
              </section>
            </div>
          ))}
        </section>
      </div>
      <div className="flex w-full flex-col gap-10">
        <section className="flex flex-col gap-2">
          <header className="text-lg font-semibold text-cyan-700">
            <h2>Summary</h2>
          </header>
          <div className="flex flex-col gap-3 rounded-lg bg-slate-50/75 p-6 shadow-md">
            <div className="flex flex-col gap-1">
              <p className="flex justify-between">
                Total items cost{' '}
                <span className="font-medium">{formatMoney(order.total)}</span>
              </p>
              <p className="flex justify-between">
                Shipping cost{' '}
                <span className="font-medium">{formatMoney(0)}</span>
              </p>
            </div>
            <hr />
            <p className="flex items-center justify-between font-bold">
              Total
              <span className="rounded-lg bg-green-50 px-1 py-0.5 text-lg text-green-600 shadow-sm">
                {formatMoney(order.total)}
              </span>
            </p>
          </div>
        </section>
        <div className="flex items-center gap-2">
          <SubmitButton
            className="px-3 py-2"
            disabled={isSubmitting}
            placeholder="Placing order"
          >
            Place order
          </SubmitButton>
          <Link href="/cart" className="btn-alternative px-3 py-2">
            Cancel
          </Link>
        </div>
      </div>
      {showAddressForm && (
        <AddAddressForm
          addAddress={addAddress}
          close={() => setShowAddressForm(false)}
        />
      )}
    </form>
  );
}
