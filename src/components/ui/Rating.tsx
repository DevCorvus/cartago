import { HiMiniStar, HiOutlineStar } from 'react-icons/hi2';

interface Props {
  score: number;
}

export default function Rating({ score }: Props) {
  return (
    <ul
      title={`Rating ${score}/5`}
      className="flex items-center text-lg text-yellow-500"
    >
      {Array(score)
        .fill(null)
        .map((_, i) => (
          <li key={Date.now() + i}>
            <HiMiniStar />
          </li>
        ))}
      {Array(5 - score)
        .fill(null)
        .map((_, i) => (
          <li key={Date.now() * 2 + i}>
            <HiOutlineStar />
          </li>
        ))}
    </ul>
  );
}
