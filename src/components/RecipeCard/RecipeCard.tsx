import {Link} from 'react-router-dom';
import type {Recipe} from '../../types';
import s from './RecipeCard.module.css';
import {BiCategory} from 'react-icons/bi';
import {FaStopwatch} from 'react-icons/fa6';
import {RiFileList3Line} from 'react-icons/ri';

const RecipeCard = ({recipe}: {recipe: Recipe}) => {
  if (!recipe?.id || !recipe?.title) {
    console.warn('RecipeCard: Invalid recipe data', recipe);
    return null;
  }

  const formattedIngredients =
    recipe.ingredients
      ?.split('\n')
      .map((item) => item.trim())
      .filter(Boolean)
      .join(', ') ?? '';

  return (
    <Link to={`/recipe/${recipe.id}`} className={s.recipeCard}>
      <h3 className={s.recipeTitle}>{recipe.title}</h3>
      <div className={s.recipeDetails}>
        <p className={s.recipeCategory}>
          <BiCategory />
          {recipe.category}
        </p>
        {recipe.cooking_time && (
          <p className={s.recipeTime}>
            <FaStopwatch />
            {recipe.cooking_time} хв
          </p>
        )}
      </div>
      <div className={s.recipeDescription}>
        <RiFileList3Line /> Інгредієнти:&nbsp;
        <span className={s.ingredients}>
          {formattedIngredients || 'Немає інгредієнтів'}
        </span>
      </div>
    </Link>
  );
};
export default RecipeCard;
