import Skeleton from 'react-loading-skeleton';

export default function SkeletonProductReviewItem() {
  return (
    <div className="flex gap-1.5 rounded-lg border-b-2 border-r-2 border-neutral-100 bg-white p-4 shadow-sm">
      <Skeleton
        circle={true}
        width={30}
        height={30}
        containerClassName="-mt-1.5"
      />
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Skeleton containerClassName="w-[50%]" height={16} />
          <Skeleton containerClassName="w-[25%]" height={16} />
        </div>
        <Skeleton count={2} width="100%" height={10} />
      </div>
    </div>
  );
}
