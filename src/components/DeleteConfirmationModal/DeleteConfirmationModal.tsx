import s from './DeleteConfirmationModal.module.css';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirmDelete,
}) => {
  if (!isOpen) return null;
  return (
    <div className={s.modalOverlay}>
      <div className={s.deleteConfirmationModal}>
        <h2 className={s.modalTitle}>Видалити рецепт</h2>
        <p className={s.modalDescription}>
          Ви впевнені, що хочете видалити цей рецепт? Цю дію неможливо
          скасувати.
        </p>
        <div className={s.modalButtons}>
          <button className={s.cancelButton} onClick={onClose}>
            Скасувати
          </button>
          <button className={s.confirmDeleteButton} onClick={onConfirmDelete}>
            Видалити
          </button>
        </div>
      </div>
    </div>
  );
};
export default DeleteConfirmationModal;
