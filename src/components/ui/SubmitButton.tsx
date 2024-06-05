import { ImSpinner8 } from 'react-icons/im';

interface Props {
  children: React.ReactNode;
  disabled: boolean;
  className: string;
  /** Placeholder displayed when disabled */
  placeholder: string;
}

export default function SubmitButton({
  children,
  disabled,
  className,
  placeholder,
}: Props) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`${disabled ? 'btn-disabled' : 'btn'} flex items-center justify-center gap-2 ${className}`}
    >
      {!disabled ? (
        <>{children}</>
      ) : (
        <>
          <ImSpinner8 className="animate-spin" />
          {placeholder}
        </>
      )}
    </button>
  );
}
