import Portal from './Portal';

interface Props {
  children: React.ReactNode;
}

export function Modal({ children }: Props) {
  return (
    <Portal id="modal-container">
      <div className="z-50 fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
        {children}
      </div>
    </Portal>
  );
}
