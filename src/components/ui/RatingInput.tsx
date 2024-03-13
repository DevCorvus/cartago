import { useEffect, useState } from 'react';
import { HiMiniStar, HiOutlineStar } from 'react-icons/hi2';

interface Props {
  defaultValue?: number;
  handler(x: number): void;
  error?: boolean;
}

export default function RatingInput({
  defaultValue,
  handler,
  error = false,
}: Props) {
  const [value, setValue] = useState(defaultValue || 0);

  useEffect(() => {
    handler(value);
  }, [value, handler]);

  return (
    <div
      className={`px-1 text-yellow-500 rounded-full ${
        error ? 'border border-red-400' : ''
      }`}
    >
      {Array(5)
        .fill(null)
        .map((_, i) => (
          <button key={i} type="button" onClick={() => setValue(i + 1)}>
            {i + 1 > value ? <HiOutlineStar /> : <HiMiniStar />}
          </button>
        ))}
    </div>
  );
}
