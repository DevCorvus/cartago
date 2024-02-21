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

interface Props {
  order: OrderDto;
}

export default function OrderDetails({ order }: Props) {
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch(`/api/orders/${order.id}/confirm-delivery`, {
      method: 'PUT',
    });

    if (res.ok) {
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <header className="text-green-800 font-bold text-2xl">
        <h2 className="flex items-center gap-2">
          Order details
          <OrderStatusTag status={order.status} className="text-lg" />
        </h2>
      </header>
      <section className="text-sm flex flex-col gap-1">
        <p>
          <strong>ID</strong>{' '}
          <span className="bg-white px-1 py-0.5 rounded-md shadow-sm">
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
          <p>Your location</p>
        </div>
      </section>
      <section className="flex flex-col gap-2">
        <header className="text-lg font-bold text-green-800">
          <h3>Payment method</h3>
        </header>
        <p className="input-alternative p-2.5 flex justify-between items-center">
          {order.payment.method}
          <PaymentStatusTag status={order.payment.status} />
        </p>
      </section>
      <section className="flex flex-col gap-2">
        <header className="text-lg font-bold text-green-800">
          <h3>Items</h3>
        </header>
        {order.items.map((item, i) => (
          <div key={i} className="flex gap-2 bg-white rounded-md shadow-md">
            <Link
              href={`/items/${item.id}`}
              className="relative w-20 h-20 bg-slate-100 rounded-l-md"
            >
              <Image
                src={'/uploads/' + item.image.path}
                alt={item.title}
                fill={true}
                className="rounded-md object-contain"
              />
            </Link>
            <section className="flex-1 p-1 pr-3 flex flex-col justify-around">
              <div>
                <p>{item.title}</p>
                <p className="line-clamp-1 font-sans text-sm opacity-70">
                  {item.description}
                </p>
              </div>
              <div className="text-sm flex items-center justify-between">
                <p>
                  <span className="text-slate-500">Price</span>{' '}
                  <span className="text-green-800 px-1 py-0.5 bg-green-100 rounded-md">
                    {formatMoney(item.price)}
                  </span>
                </p>
                <p>
                  <span className="text-slate-500">Quantity</span>{' '}
                  <span className="text-green-800 px-1 py-0.5 bg-green-100 rounded-md">
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
        <div className="flex flex-col gap-3 input-alternative p-6">
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
            className="w-full btn p-3 flex items-center justify-center gap-2"
          >
            <HiOutlineCheckCircle className="text-xl" />
            Confirm Delivery
          </button>
        </form>
      )}
    </div>
  );
}
