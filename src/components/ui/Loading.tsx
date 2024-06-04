import { ImSpinner8 } from 'react-icons/im';

export default function Loading() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="inline-flex animate-spin text-3xl text-cyan-500">
        <ImSpinner8 />
      </span>
    </div>
  );
}
