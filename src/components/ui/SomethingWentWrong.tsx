import { HiOutlineFaceFrown } from 'react-icons/hi2';

export default function SomethingWentWrong() {
  return (
    <div className="flex items-center justify-center">
      <p className="flex items-center gap-1.5 text-xl text-red-400">
        Something went wrong
        <HiOutlineFaceFrown className="text-3xl" />
      </p>
    </div>
  );
}
