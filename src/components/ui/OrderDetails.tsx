'use client';

import Image from 'next/image';
import OrderStatusTag from '@/components/ui/OrderStatusTag';
import { formatDate } from '@/utils/formatDate';
import {
  HiOutlineQuestionMarkCircle,
  HiOutlineCheckCircle,
} from 'react-icons/hi2';
import { OrderDto } from '@/shared/dtos/order.dto';
import { formatMoney } from '@/lib/dinero';
import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import PaymentStatusTag from './PaymentStatusTag';
import Link from 'next/link';
import { useConfirmDelivery } from '@/data/order';
import { toastError } from '@/lib/toast';

interface Props {
  order: OrderDto;
}

export default function OrderDetails({ order }: Props) {
  const router = useRouter();

  const confirmDeliveryMutation = useConfirmDelivery();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await confirmDeliveryMutation.mutateAsync(order.id);
      router.refresh();
    } catch (err) {
      toastError(err);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <header className="text-2xl font-bold text-green-800">
        <h2 className="flex items-center gap-2">
          Order details
          <OrderStatusTag status={order.status} className="text-lg" />
        </h2>
      </header>
      <section className="flex flex-col gap-1 text-sm">
        <p>
          <strong>ID</strong>{' '}
          <span className="rounded-md bg-white px-1 py-0.5 shadow-sm">
            {order.id}
          </span>
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
        <header className="text-lg font-bold text-green-800">
          <h3>Shipping address</h3>
        </header>
        <div>
          <p className="input-alternative p-3">{order.address.nickname}</p>
        </div>
      </section>
      <section className="flex flex-col gap-2">
        <header className="text-lg font-bold text-green-800">
          <h3>Payment method</h3>
        </header>
        <p className="input-alternative flex items-center justify-between p-2.5">
          {order.payment.method}
          <PaymentStatusTag status={order.payment.status} />
        </p>
      </section>
      {order.shipment && (
        <section className="flex flex-col gap-2">
          <header className="text-lg font-bold text-green-800">
            <h3>Shipment</h3>
          </header>
          <p className="input-alternative flex items-center justify-between p-2.5">
            Status
            <span className="rounded-md border border-gray-100 bg-green-100 px-1.5 py-0.5 text-green-500">
              {order.shipment.status.replace(/_/g, ' ')}
            </span>
          </p>
        </section>
      )}
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
            <section className="flex flex-1 flex-col justify-around p-1 pr-3">
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
      {order.status === 'SHIPPED' && (
        <form onSubmit={handleSubmit}>
          <button
            type="submit"
            className="btn flex w-full items-center justify-center gap-2 p-3"
          >
            <HiOutlineCheckCircle className="text-xl" />
            Confirm Delivery
          </button>
        </form>
      )}
    </div>
  );
}
