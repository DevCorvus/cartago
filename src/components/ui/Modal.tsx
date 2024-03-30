import Portal from './Portal';

interface Props {
  children: React.ReactNode;
  id?: string;
}

export default function Modal({ children, id = 'modal-container' }: Props) {
  return (
    <Portal id={id}>
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50">
        {children}
      </div>
    </Portal>
  );
}
