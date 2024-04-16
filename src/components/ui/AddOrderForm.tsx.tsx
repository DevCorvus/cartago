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
import { ImSpinner8 } from 'react-icons/im';
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

interface Props {
  order: CheckoutOrderDto;
}

export default function AddOrderForm({ order }: Props) {
  const router = useRouter();
  const [addresses, setAddresses] = useState<AddressMinimalDto[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const { isLoading, isError, data } = useMinimalAddresses();

  useEffect(() => {
    if (data) setAddresses(data);
  }, [data]);

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
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreatePaymentDto>({
    resolver: zodResolver(createPaymentSchema),
  });

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
    <form onSubmit={submitWrapper} className="space-y-10">
      <div className="space-y-10">
        <header className="text-2xl font-bold text-green-800">
          <h2 className="flex items-center gap-2">
            Placing order
            <OrderStatusTag status={order.status} className="text-lg" />
          </h2>
        </header>
        <section className="space-y-1 text-sm">
          <p>
            <strong>ID</strong>{' '}
            <span className="rounded-md bg-white px-1 py-0.5">{order.id}</span>
          </p>
          <p>
            <strong>Date</strong> {formatDate(new Date(order.createdAt))}{' '}
            <HiOutlineQuestionMarkCircle
              className="inline-block text-green-800"
              title="MM/DD/YYYY"
            />
          </p>
        </section>
        <section className="flex flex-col gap-2">
          <header className="flex items-center justify-between text-lg font-bold text-green-800">
            <h3>Shipping address</h3>
            <div>
              <button
                onClick={() => setShowAddressForm(true)}
                title="Add new address"
                type="button"
                className="btn-square p-0.5"
              >
                <HiPlus className="text-base" />
              </button>
            </div>
          </header>
          <div>
            <div className="flex gap-2">
              <select
                className="input-alternative p-3"
                {...register('address')}
                defaultValue={
                  addresses.find((address) => address.default)?.id || ''
                }
              >
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
        <section className="flex flex-col gap-2">
          <header className="text-lg font-bold text-green-800">
            <h3>Payment method</h3>
          </header>
          <div>
            <select
              className="input-alternative p-3"
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
        <section className="flex flex-col gap-2">
          <header className="text-lg font-bold text-green-800">
            <h3>Items</h3>
          </header>
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex gap-2 rounded-md bg-white shadow-md"
            >
              <Link
                href={`/items/${item.id}`}
                className="relative h-20 w-20 rounded-l-md bg-slate-100"
              >
                <Image
                  src={'/images/' + item.image.path}
                  alt={item.title}
                  fill={true}
                  className="rounded-md object-contain"
                />
              </Link>
              <section className="flex flex-1 flex-col justify-around p-1">
                <div>
                  <p>{item.title}</p>
                  <p className="line-clamp-1 font-sans text-sm opacity-70">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <p>
                    <span className="text-slate-500">Price</span>{' '}
                    <span className="rounded-md bg-green-100 px-1 py-0.5 text-green-800">
                      {formatMoney(item.price)}
                    </span>
                  </p>
                  <p>
                    <span className="text-slate-500">Quantity</span>{' '}
                    <span className="rounded-md bg-green-100 px-1 py-0.5 text-green-800">
                      {item.amount}
                    </span>
                  </p>
                </div>
              </section>
            </div>
          ))}
        </section>
      </div>
      <div className="flex w-full max-w-xs flex-col gap-10">
        <section className="flex flex-col gap-2">
          <header className="text-lg font-bold text-green-800">
            <h3>Summary</h3>
          </header>
          <div className="input-alternative flex flex-col gap-3 p-6">
            <div className="flex flex-col gap-1">
              <p className="flex justify-between">
                Total items cost <span>{formatMoney(order.total)}</span>
              </p>
              <p className="flex justify-between">
                Shipping cost <span>{formatMoney(0)}</span>
              </p>
            </div>
            <hr />
            <p className="flex justify-between font-bold">
              Total
              <strong className="text-green-800">
                {formatMoney(order.total)}
              </strong>
            </p>
          </div>
        </section>
        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="btn flex items-center gap-2 px-3 py-2"
            disabled={isSubmitting}
          >
            {isSubmitting && <ImSpinner8 className="animate-spin" />}
            Place order
          </button>
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
