import { PaymentStatus } from '@/server/payment/payment.types';

function getStatusColor(status: PaymentStatus) {
  switch (status) {
    case 'PENDING': {
      return 'bg-orange-100 text-orange-500';
    }
    case 'PROCESSING': {
      return 'bg-orange-100 text-orange-500';
    }
    case 'COMPLETED': {
      return 'bg-green-100 text-green-500';
    }
    case 'REFUNDED': {
      return 'bg-lime-100 text-lime-500';
    }
    case 'FAILED': {
      return 'bg-red-100 text-red-500';
    }
  }
}

interface Props {
  status: PaymentStatus;
  className?: string;
}

export default function PaymentStatusTag({ status, className = '' }: Props) {
  return (
    <span
      className={`${getStatusColor(
        status,
      )} rounded-md border border-gray-100 px-1.5 py-0.5 ${className}`}
    >
      {status}
    </span>
  );
}
