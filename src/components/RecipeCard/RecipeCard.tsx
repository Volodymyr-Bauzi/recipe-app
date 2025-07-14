import {Link} from 'react-router-dom';
import type {Recipe} from '../../types';
import s from './RecipeCard.module.css';

const RecipeCard = ({recipe}: {recipe: Recipe}) => {
  return (
    <Link
      to={`/recipe/${recipe.id}`}
      key={recipe.id}
      className={s.recipeCard}
      style={{textDecoration: 'none', color: 'inherit'}}
    >
      <h3 className={s.recipeTitle}>{recipe.title}</h3>
      <p className={s.recipeCategory}>{recipe.category}</p>
      <p className={s.recipeDescription}>{recipe.description}</p>
      {recipe.cooking_time && (
        <p className={s.recipeTime}>
          Час приготування: {recipe.cooking_time} хв
        </p>
      )}
    </Link>
  );
};
export default RecipeCard;
