import { ImSpinner8 } from 'react-icons/im';

export default function Loading() {
  return (
    <div className="flex items-center justify-center">
      <span className="inline-flex animate-spin text-3xl text-green-800">
        <ImSpinner8 />
      </span>
    </div>
  );
}
