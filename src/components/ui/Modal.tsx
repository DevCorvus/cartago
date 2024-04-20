import { useEffect, useRef } from 'react';
import Portal from './Portal';

interface Props {
  children: React.ReactNode;
  id?: string;
  close?: () => void;
}

export default function Modal({
  children,
  id = 'modal-container',
  close,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const modalContainer = ref.current;
    if (modalContainer) {
      const focusableElements = modalContainer.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabIndex]:not([tabIndex="-1"])',
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleTabKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      const handleEscapeKeyPress = (e: KeyboardEvent) => {
        if (close && e.key === 'Escape') {
          close();
        }
      };

      document.addEventListener('keydown', handleTabKeyPress);
      document.addEventListener('keydown', handleEscapeKeyPress);

      return () => {
        document.removeEventListener('keydown', handleTabKeyPress);
        document.removeEventListener('keydown', handleEscapeKeyPress);
      };
    }
  }, [close]);

  return (
    <Portal id={id}>
      <div
        ref={ref}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50"
      >
        {children}
      </div>
    </Portal>
  );
}
