// RecipePage/RecipeInfo.tsx
import React from 'react';
import {BiCategory} from 'react-icons/bi';
import {FaStopwatch} from 'react-icons/fa6';
import {useTranslation} from '../../hooks/useTranslation';
import s from './RecipePage.module.css';

interface RecipeInfoProps {
  category: string;
  cookingTime: number | undefined;
}

const RecipeInfo: React.FC<RecipeInfoProps> = ({category, cookingTime}) => {
  const {t} = useTranslation();

  return (
    <div className={s.recipeInfo}>
      <span className={s.recipeCategory}>
        <BiCategory />
        <strong>{t('recipe.category.label')}</strong>
        &nbsp;{category}
      </span>
      <span className={s.recipeCookingTime}>
        <FaStopwatch />
        <strong>{t('recipe.cookingTime.label')}</strong>
        &nbsp;{cookingTime} {t('recipe.minutes.full')}
      </span>
    </div>
  );
};

export default RecipeInfo;
