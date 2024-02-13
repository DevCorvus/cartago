'use client';

import { OrderDto } from '@/shared/dtos/order.dto';
import Portal from './Portal';
import { useClickOutside } from '@/hooks/useClickOutside';
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi2';
import { OrderStatus } from '@/server/order/order.types';
import Image from 'next/image';
import { formatMoney } from '@/lib/dinero';

function padtoTwoDigits(x: number) {
  return x.toString().padStart(2, '0');
}

function formatDate(date: Date) {
  return [
    padtoTwoDigits(date.getMonth() + 1),
    padtoTwoDigits(date.getDate()),
    date.getFullYear(),
  ].join('/');
}

function getStatusColor(status: OrderStatus) {
  switch (status) {
    case 'PENDING': {
      return 'bg-orange-100 text-orange-500';
    }
    case 'SHIPPED': {
      return 'bg-sky-100 text-sky-500';
    }
    case 'DELIVERED': {
      return 'bg-green-100 text-green-500';
    }
  }
}

interface Props {
  order: OrderDto;
  close(): void;
}

export default function OrderDetailsModal({ order, close }: Props) {
  const ref = useClickOutside<HTMLDivElement>(close);

  return (
    <Portal id="modal-container">
      <div className="z-50 absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
        <div
          ref={ref}
          className="w-full lg:container overflow-y-auto bg-white shadow-md lg:rounded-lg p-10 lg:p-12 border-2 border-gray-50 flex flex-col lg:flex-row gap-10"
        >
          <div className="flex-1 flex flex-col gap-10">
            <header className="text-green-800 font-bold text-2xl">
              <h2 className="flex items-center gap-2">
                Placing order
                <span
                  className={`${getStatusColor(
                    order.status,
                  )} px-1.5 py-0.5 rounded-md text-lg border border-gray-100`}
                >
                  {order.status}
                </span>
              </h2>
            </header>
            <section className="text-sm flex flex-col gap-1">
              <p>
                <strong>ID</strong>{' '}
                <span className="bg-slate-100 px-1 py-0.5 rounded-md">
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
              <div>
                <select className="input p-3">
                  <option value="BISON">BISON</option>
                  <option value="HUMBLECARD">HumbleCard</option>
                  <option value="PAYMATE">PayMate</option>
                </select>
              </div>
            </section>
            <section className="flex flex-col gap-2">
              <header className="text-lg font-bold text-green-800">
                <h3>Items</h3>
              </header>
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-2 bg-slate-100 rounded-md shadow-md"
                >
                  <div className="relative w-20 h-20 bg-slate-200 rounded-l-md">
                    <Image
                      src={'/uploads/' + item.image.path}
                      alt={item.title}
                      fill={true}
                      className="rounded-md object-contain"
                    />
                  </div>
                  <section className="flex-1 p-1 flex flex-col justify-around">
                    <div>
                      <p>{item.title}</p>
                      <p>{item.description}</p>
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
          </div>
          <div className="flex flex-col gap-10 max-w-xs w-full">
            <section className="flex flex-col gap-2">
              <header className="text-lg font-bold text-green-800">
                <h3>Summary</h3>
              </header>
              <div className="flex flex-col gap-3 input p-6">
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
              <button className="px-3 py-2 btn">Place order</button>
              <button onClick={close} className="px-3 py-2 btn-alternative">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
