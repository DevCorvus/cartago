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
