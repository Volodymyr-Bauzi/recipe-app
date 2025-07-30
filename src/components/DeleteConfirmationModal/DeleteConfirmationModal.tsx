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
        <h2>Видалити рецепт</h2>
        <p>
          Ви впевнені, що хочете видалити цей елемент? Цю дію неможливо
          скасувати.
        </p>
        <div className={s.ModalButtons}>
          <button onClick={onClose}>Скасувати</button>
          <button onClick={onConfirmDelete}>Видалити</button>
        </div>
      </div>
    </div>
  );
};
export default DeleteConfirmationModal;
