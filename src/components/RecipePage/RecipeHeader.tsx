// RecipePage/RecipeHeader.tsx
import React from 'react';
import {FaRegPenToSquare, FaRegTrashCan} from 'react-icons/fa6';
import {useTranslation} from '../../hooks/useTranslation';
import s from './RecipePage.module.css';

interface RecipeHeaderProps {
  title: string;
  canModify: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const RecipeHeader: React.FC<RecipeHeaderProps> = ({
  title,
  canModify,
  onEdit,
  onDelete,
}) => {
  const {t} = useTranslation();

  return (
    <div className={s.recipeHeader}>
      <h1 className={s.recipeTitle}>{title}</h1>

      {canModify && (
        <div className={s.modify}>
          <button className={s.editButton} onClick={onEdit}>
            <FaRegPenToSquare />
            {t('recipe.edit')}
          </button>
          <button
            className={`${s.editButton} ${s.deleteButton}`}
            onClick={onDelete}
          >
            <FaRegTrashCan />
            {t('recipe.delete')}
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeHeader;
