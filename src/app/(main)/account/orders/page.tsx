import OrderStatusTag from '@/components/ui/OrderStatusTag';
import PaymentStatusTag from '@/components/ui/PaymentStatusTag';
import { formatMoney } from '@/lib/dinero';
import { UserSession } from '@/server/auth/auth.types';
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
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-green-800 font-bold text-2xl">Orders</h1>
      </header>
      <ul className="flex flex-col gap-3">
        {orders.map((order) => (
          <li key={order.id}>
            <Link
              href={`/account/orders/${order.id}`}
              className="bg-white flex items-center rounded-md shadow-md"
            >
              <div className="relative w-28 h-28 bg-slate-200 rounded-l-md">
                <Image
                  src={'/uploads/' + order.image.path}
                  alt="Order preview"
                  fill={true}
                  className="rounded-md object-contain"
                />
              </div>
              <div className="p-4 flex flex-col gap-1.5">
                <span
                  title="Order ID"
                  className="bg-slate-100 px-1 py-0.5 rounded-md"
                >
                  {order.id}
                </span>
                <div className="text-sm text-slate-500 grid grid-cols-2 gap-1.5">
                  <p className="col-span-1">
                    <span>Total</span>{' '}
                    <span className="text-green-800">
                      {formatMoney(order.total)}
                    </span>
                  </p>
                  <p className="col-span-1">
                    <span>Created at</span>{' '}
                    <span>{formatDate(order.createdAt)}</span>
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
