import OrderStatusTag from '@/components/ui/OrderStatusTag';
import PaymentStatusTag from '@/components/ui/PaymentStatusTag';
import { formatMoney } from '@/lib/dinero';
import { orderService } from '@/server/services';
import { formatDate } from '@/utils/formatDate';
import Image from 'next/image';
import Link from 'next/link';
import { HiOutlineTruck } from 'react-icons/hi2';
import { getUserSession } from '@/server/auth/auth.utils';
import { redirect } from 'next/navigation';

export default async function Orders() {
  const user = await getUserSession();

  if (!user) {
    redirect('/login');
  }

  const orders = await orderService.findAll(user.id);

  if (orders.length === 0) {
    return (
      <div className="absolute inset-0 flex h-screen w-screen items-center justify-center">
        <section className="max-w-md space-y-3 rounded-lg text-center text-slate-400">
          <header className="space-y-1">
            <HiOutlineTruck className="mx-auto text-5xl" />
            <h1 className="font-semibold">No orders yet</h1>
          </header>
          <Link
            href="/items"
            className="inline-block w-56 text-xs italic hover:underline"
          >
            Add something to keep the wheels of capitalism rolling!
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 rounded-lg bg-white p-8 text-slate-700 shadow-md">
      <header>
        <h1 className="text-2xl font-bold text-cyan-700">Orders</h1>
      </header>
      <ul className="space-y-3">
        {orders.map((order) => (
          <li key={order.id}>
            <Link
              href={`/account/orders/${order.id}`}
              className="flex flex-col items-center rounded-lg bg-slate-50/75 shadow-md md:flex-row"
            >
              <div className="md:size-28 relative h-32 w-full rounded-l-md bg-neutral-100">
                <Image
                  src={'/images/' + order.image.path}
                  alt="Order preview"
                  fill={true}
                  sizes="200px"
                  className="rounded-lg object-contain"
                />
              </div>
              <div className="flex flex-col gap-2 p-4 md:p-2">
                <span
                  title="Order ID"
                  className="rounded-md bg-slate-200/50 px-1 py-0.5 text-center text-xs sm:text-sm md:text-base"
                >
                  {order.id}
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 md:text-sm">
                  <p className="col-span-1 flex flex-col gap-1 sm:flex-row">
                    <span>Total</span>{' '}
                    <span className="font-medium text-slate-600">
                      {formatMoney(order.total)}
                    </span>
                  </p>
                  <p className="col-span-1 flex flex-col gap-1 sm:flex-row">
                    <span>Created at</span>{' '}
                    <span className="font-medium text-slate-600">
                      {formatDate(order.createdAt)}
                    </span>
                  </p>
                  <p className="col-span-1 flex flex-col gap-1 sm:flex-row">
                    <span>Status</span>
                    <span>
                      <OrderStatusTag status={order.status} />
                    </span>
                  </p>
                  <p className="col-span-1 flex flex-col gap-1 sm:flex-row">
                    <span>Payment</span>
                    <span>
                      <PaymentStatusTag status={order.payment.status} />
                    </span>
                  </p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
