import {useTranslation} from '../../hooks/useTranslation';
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
  const {t} = useTranslation();
  if (!isOpen) return null;

  return (
    <div className={s.modalOverlay}>
      <div className={s.deleteConfirmationModal}>
        <h2 className={s.modalTitle}>{t('modal.deleteRecipe.title')}</h2>
        <p className={s.modalDescription}>
          {t('modal.deleteRecipe.description')}
        </p>
        <div className={s.modalButtons}>
          <button className={s.cancelButton} onClick={onClose}>
            {t('modal.cancel')}
          </button>
          <button className={s.confirmDeleteButton} onClick={onConfirmDelete}>
            {t('modal.delete')}
          </button>
        </div>
      </div>
    </div>
  );
};
export default DeleteConfirmationModal;
