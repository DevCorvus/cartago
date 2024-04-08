import { isErrorWithMessage } from '@/utils/error';
import toast from 'react-hot-toast';

export function toastError(err?: unknown) {
  let message: string;

  if (err && isErrorWithMessage(err)) {
    message = err.message;
  } else {
    message = 'Something went wrong';
  }

  toast.error(message + ' .(');
}

export function toastAmountSynced(title: string) {
  toast(
    () => (
      <p>
        <strong>{title}</strong> amount is higher than current stock available.
        It will now be equal to the remaining stock to keep you in sync.
      </p>
    ),
    { duration: 5000 },
  );
}
