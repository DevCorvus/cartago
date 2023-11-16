import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  children: ReactNode;
  id: string;
}

export default function Portal({ children, id }: Props) {
  const container = document.getElementById(id);

  if (!container) {
    throw new Error(`${id} not found`);
  }

  return createPortal(children, container);
}
