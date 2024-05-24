import OrderStatusTag from '@/components/ui/OrderStatusTag';
import PaymentStatusTag from '@/components/ui/PaymentStatusTag';
import { formatMoney } from '@/lib/dinero';
import { UserSession } from '@/shared/auth/auth.types';
import withAuth from '@/server/middlewares/withAuth';
import { orderService } from '@/server/services';
import { formatDate } from '@/utils/formatDate';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  user: UserSession;
}

async function Orders({ user }: Props) {
  const orders = await orderService.findAll(user.id);

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
                  className="rounded-md bg-slate-200/50 px-1 py-0.5 text-center text-sm md:text-base"
                >
                  {order.id}
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 md:text-sm">
                  <p className="col-span-1 flex gap-3">
                    <span>Total</span>
                    <span className="font-medium text-slate-600">
                      {formatMoney(order.total)}
                    </span>
                  </p>
                  <p className="col-span-1">
                    <span>Created at</span>{' '}
                    <span className="font-medium text-slate-600">
                      {formatDate(order.createdAt)}
                    </span>
                  </p>
                  <p className="col-span-1">
                    <span>Order</span> <OrderStatusTag status={order.status} />
                  </p>
                  <p className="col-span-1">
                    <span>Payment</span>{' '}
                    <PaymentStatusTag status={order.payment.status} />
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

export default withAuth(Orders);
