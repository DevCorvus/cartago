import Skeleton from 'react-loading-skeleton';

export default function SkeletonProductItem() {
  return (
    <div className="flex flex-col rounded-lg border-b-2 border-neutral-100 bg-white shadow-md">
      <div className="aspect-square w-full rounded-t-lg bg-neutral-100 shadow-inner">
        <Skeleton width="100%" height="100%" />
      </div>
      <section className="flex flex-1 flex-col gap-1 p-2">
        <header>
          <h2>
            <Skeleton height={16} width="100%" />
          </h2>
        </header>
        <div className="flex items-center justify-between">
          <Skeleton height={16} containerClassName="w-[30%]" />
          <Skeleton height={16} containerClassName="w-[50%]" />
        </div>
      </section>
    </div>
  );
}
