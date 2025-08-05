// RecipePage/RecipeContent.tsx
import React from 'react';
import {RiFileList3Line} from 'react-icons/ri';
import {GoChecklist} from 'react-icons/go';
import {useTranslation} from '../../hooks/useTranslation';
import useWindowWidth from '../../hooks/useWindowWidth';
import FormattedText from './FormattedText';
import s from './RecipePage.module.css';

interface RecipeContentProps {
  description?: string;
  ingredients: string | undefined;
  instructions: string | undefined;
}

const RecipeContent: React.FC<RecipeContentProps> = ({
  description,
  ingredients,
  instructions,
}) => {
  const {t} = useTranslation();
  const width = useWindowWidth();

  return (
    <>
      {description && (
        <div className={s.recipeDescription}>
          <p>{description}</p>
        </div>
      )}

      <div className={s.recipeSection}>
        <h2 className={s.sectionTitle}>
          <RiFileList3Line /> {t('recipe.ingredients.title')}:
        </h2>
        <FormattedText
          text={ingredients}
          fallback="Інгредієнти не вказані."
          listClassName={s.ingredientsList}
          ordered={false}
        />
      </div>

      <div className={s.recipeSection}>
        <h2 className={s.sectionTitle}>
          <GoChecklist />
          {width < 426
            ? t('recipe.instructions.title.short')
            : t('recipe.instructions.title.full')}
        </h2>
        <FormattedText
          text={instructions}
          fallback="Інструкції не надані."
          listClassName={s.instructionsList}
          ordered={true}
        />
      </div>
    </>
  );
};

export default RecipeContent;
