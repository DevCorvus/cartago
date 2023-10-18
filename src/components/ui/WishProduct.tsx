import { useState } from 'react';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi2';

export default function WishProduct() {
  const [isWished, setWished] = useState(false);
  return (
    <button onClick={() => setWished((prev) => !prev)}>
      {isWished ? (
        <HiHeart className=" text-rose-500 text-3xl" />
      ) : (
        <HiOutlineHeart className=" text-rose-500 text-3xl" />
      )}
    </button>
  );
}
