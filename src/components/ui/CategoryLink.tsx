import { useObserver } from '@/hooks/useObserver';
import { capitalize } from '@/utils/capitalize';
import Link from 'next/link';

interface Props {
  categoryId: number;
  title: string;
}

export default function CategoryLink({ categoryId, title }: Props) {
  const { observerTarget, isVisible } = useObserver();

  return (
    <Link
      ref={observerTarget}
      tabIndex={isVisible ? 0 : -1}
      href={`/items?categoryId=${categoryId}`}
      className="text-nowrap rounded-full bg-white px-2 py-1.5 text-sm text-slate-500 shadow-md transition hover:text-cyan-500 focus:text-cyan-500 md:text-base"
    >
      {capitalize(title)}
    </Link>
  );
}
