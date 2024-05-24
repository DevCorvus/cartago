import { OrderStatus } from '@/server/order/order.types';

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
  status: OrderStatus;
  className?: string;
}

export default function OrderStatusTag({ status, className = '' }: Props) {
  return (
    <span
      className={`${getStatusColor(
        status,
      )} rounded-md border-b-2 border-r-2 border-slate-100 px-1.5 py-0.5 ${className}`}
    >
      {status}
    </span>
  );
}
