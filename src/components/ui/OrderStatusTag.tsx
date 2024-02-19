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
      )} px-1.5 py-0.5 rounded-md border border-gray-100 ${className}`}
    >
      {status}
    </span>
  );
}