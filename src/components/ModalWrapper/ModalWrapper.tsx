// components/ModalWrapper.tsx
import type {ReactNode, MouseEvent} from 'react';
import s from './ModalWrapper.module.css';

interface ModalWrapperProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export default function ModalWrapper({
  title,
  onClose,
  children,
}: ModalWrapperProps) {
  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    // Only close if clicked directly on the overlay (not inside modal)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={s.overlay} onClick={handleBackdropClick}>
      <div className={s.modal}>
        <button className={s.closeButton} onClick={onClose}>
          ×
        </button>
        <h2 className={s.title}>{title}</h2>
        {children}
      </div>
    </div>
  );
}
