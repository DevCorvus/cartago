import { useMemo } from 'react';

const ONE_WEEK = 1000 * 60 * 60 * 24 * 7;

interface Props {
  date: Date;
}

export default function NewTag({ date }: Props) {
  const isNew = useMemo(() => {
    const createdAt = new Date(date);
    const createdAtInMs = createdAt.getTime();
    return Date.now() < createdAtInMs + ONE_WEEK;
  }, [date]);

  return (
    <>
      {isNew && (
        <span className="absolute -left-3 -top-3 z-10 rounded-md border border-cyan-600 bg-cyan-50 p-1 text-xs font-semibold text-cyan-600 shadow-md">
          New
        </span>
      )}
    </>
  );
}
