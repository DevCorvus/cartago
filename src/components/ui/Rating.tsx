import { useMemo } from 'react';
import { HiMiniStar, HiOutlineStar } from 'react-icons/hi2';

enum Star {
  Empty,
  Half,
  Full,
}

function getStarIcon(star: Star) {
  switch (star) {
    case Star.Empty: {
      return <HiOutlineStar />;
    }
    case Star.Half: {
      return (
        <span className="flex">
          <span className="overflow-hidden">
            <HiMiniStar className="-mr-2" />
          </span>
          <span className="overflow-hidden">
            <HiOutlineStar className="-ml-2" />
          </span>
        </span>
      );
    }
    case Star.Full: {
      return <HiMiniStar />;
    }
  }
}

interface Props {
  score: number;
}

export default function Rating({ score }: Props) {
  const stars = useMemo(() => {
    const fullStars = Math.floor(score);
    const hasHalf = score % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    return Array(fullStars)
      .fill(Star.Full)
      .concat(hasHalf ? [Star.Half] : [], Array(emptyStars).fill(Star.Empty));
  }, []);

  return (
    <ul
      title={`Rating ${score}/5`}
      className="flex items-center text-yellow-500"
    >
      {stars.map((star, i) => (
        <li key={Date.now() + i}>{getStarIcon(star)}</li>
      ))}
    </ul>
  );
}
