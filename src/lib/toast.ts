import { isErrorWithMessage } from '@/utils/error';
import toast from 'react-hot-toast';

export function toastError(err: unknown) {
  if (isErrorWithMessage(err)) {
    toast.error(err.message);
  }
}
