import {Link} from 'react-router-dom';
import type {Recipe} from '../../types';
import s from './RecipeCard.module.css';
import {BiCategory} from 'react-icons/bi';
import {FaStopwatch} from 'react-icons/fa6';
import {RiFileList3Line} from 'react-icons/ri';
import {useTranslation} from '../../hooks/useTranslation';
import {sanitizeText} from '../../utils/textUtils';

const RecipeCard = ({recipe}: {recipe: Recipe}) => {
  const {t} = useTranslation();

  if (!recipe?.id || !recipe?.title) {
    console.warn('RecipeCard: Invalid recipe data', recipe);
    return null;
  }

  const sanitizedTitle = sanitizeText(recipe.title);
  const formattedIngredients =
    recipe.ingredients
      ?.split('\n')
      .map((item) => item.trim())
      .filter(Boolean)
      .join(', ') ?? '';

  return (
    <Link
      to={`/recipe/${recipe.id}`}
      className={s.recipeCard}
      aria-label={t('recipe.viewDetails', {title: sanitizedTitle})}
    >
      <header className={s.recipeHeader}>
        <h3 className={s.recipeTitle}>{sanitizedTitle}</h3>
      </header>

      <div className={s.recipeMetadata}>
        {recipe.category && (
          <div className={s.recipeCategory}>
            <BiCategory aria-hidden="true" />
            <span>{recipe.category}</span>
          </div>
        )}

        <div className={s.recipeTime}>
          <FaStopwatch aria-hidden="true" />
          <span>
            {recipe.cooking_time} {t('recipe.minutes')}
          </span>
        </div>
      </div>

      <div className={s.recipeIngredients}>
        <div className={s.ingredientsHeader}>
          <RiFileList3Line aria-hidden="true" />
          <span className={s.ingredientsLabel}>{t('recipe.ingredients')}:</span>
        </div>

        <div className={s.ingredientsList}>
          <span className={s.ingredients}>{formattedIngredients}</span>
        </div>
      </div>
    </Link>
  );
};
export default RecipeCard;
