import { useClickOutside } from '@/hooks/useClickOutside';
import Modal from './Modal';
import { FormEvent, useState } from 'react';
import SubmitButton from './SubmitButton';

interface Props {
  action: () => Promise<void>;
  close: () => void;
}

export default function ConfirmModal({ action, close }: Props) {
  const [isLoading, setLoading] = useState(false);
  const ref = useClickOutside<HTMLFormElement>(close);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      await action();
    } catch {}
    close();
  };

  return (
    <Modal>
      <form
        ref={ref}
        onSubmit={handleSubmit}
        className="space-y-4 rounded-lg bg-white p-6 text-slate-500 shadow-md"
      >
        <header className="text-center">
          <span>Are you sure?</span>
        </header>
        <div className="flex gap-2">
          <SubmitButton
            className="px-2 py-1.5"
            disabled={isLoading}
            placeholder="Confirming"
          >
            Confirm
          </SubmitButton>
          <button
            type="button"
            onClick={close}
            className="btn-alternative px-2 py-1.5"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
