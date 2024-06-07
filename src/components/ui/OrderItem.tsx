import { formatMoney } from '@/lib/dinero';
import { OrderItemDto } from '@/shared/dtos/order.dto';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  data: OrderItemDto;
}

export default function OrderItem({ data }: Props) {
  return (
    <div className="flex gap-2 rounded-md bg-slate-50/75 shadow-md">
      <Link
        href={`/items/${data.id}`}
        className="size-20 relative rounded-l-md bg-neutral-100"
      >
        <Image
          src={'/images/' + data.image.path}
          alt={data.title}
          fill={true}
          sizes="100px"
          className="rounded-md object-contain"
        />
      </Link>
      <section className="flex flex-1 flex-col justify-around p-1">
        <header>
          <span className="line-clamp-1">{data.title}</span>
        </header>
        <div className="grid grid-cols-2 text-sm">
          <p className="flex flex-col sm:flex-row">
            <span className="text-slate-500">Amount</span>{' '}
            <span>
              <span className="rounded-xl bg-slate-100 px-1 font-medium text-slate-600 shadow-sm">
                {data.amount}
              </span>
            </span>
          </p>
          <p className="flex flex-col sm:flex-row">
            <span className="text-slate-500">Price</span>{' '}
            <span>
              <span className="rounded-xl bg-slate-100 px-1 font-medium text-slate-600 shadow-sm">
                {formatMoney(data.price)}
              </span>
            </span>
          </p>
        </div>
      </section>
    </div>
  );
}
