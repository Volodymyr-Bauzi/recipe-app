// components/ModalWrapper.tsx
import {type ReactNode, type MouseEvent, useEffect} from 'react';
import s from './ModalWrapper.module.css';

interface ModalWrapperProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export default function ModalWrapper({
  isOpen,
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

  console.log('ModalWrapper isOpen:', isOpen);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Prevent body scroll when modal is open
    } else {
      document.body.style.overflow = ''; // Restore body scroll when modal is closed
    }
    return () => {
      document.body.style.overflow = ''; // Cleanup on unmount
    };
  }, [isOpen]);

  if (!isOpen) return null; // Don't render anything if modal is closed

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
