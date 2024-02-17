import { PaymentStatus } from '@/server/payment/payment.types';

function getStatusColor(status: PaymentStatus) {
  switch (status) {
    case 'PENDING': {
      return 'bg-orange-100 text-orange-500';
    }
    case 'FAILED': {
      return 'bg-red-100 text-red-500';
    }
    case 'COMPLETED': {
      return 'bg-green-100 text-green-500';
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
      )} px-1.5 py-0.5 rounded-md border border-gray-100 ${className}`}
    >
      {status}
    </span>
  );
}
