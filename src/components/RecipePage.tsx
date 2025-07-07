import React from 'react';
import type {Recipe} from '../types';
import styles from './RecipePage.module.css'; // Create this file

const RecipePage: React.FC<{recipe: Recipe}> = ({recipe}) => {
  // Format ingredients as a list if they contain line breaks
  const formatIngredients = () => {
    if (!recipe.ingredients) return <p>Інгредієнти не вказані.</p>;

    const items = recipe.ingredients.split('\n').filter((item) => item.trim());

    if (items.length <= 1) return <p>{recipe.ingredients}</p>;

    return (
      <ul className={styles.ingredientsList}>
        {items.map((item, index) => (
          <li key={index}>{item.trim()}</li>
        ))}
      </ul>
    );
  };

  // Format instructions as steps if they contain line breaks
  const formatInstructions = () => {
    if (!recipe.instructions) return <p>Інструкції не надані.</p>;

    const steps = recipe.instructions.split('\n').filter((step) => step.trim());

    if (steps.length <= 1) return <p>{recipe.instructions}</p>;

    return (
      <ol className={styles.instructionsList}>
        {steps.map((step, index) => (
          <li key={index}>{step.trim()}</li>
        ))}
      </ol>
    );
  };

  return (
    <div className={styles.recipePage}>
      <h1 className={styles.recipeTitle}>{recipe.title}</h1>

      <div className={styles.recipeInfo}>
        <span className={styles.recipeCategory}>
          <strong>Категорія:</strong> {recipe.category}
        </span>
        <span className={styles.recipeCookingTime}>
          <strong>Час приготування:</strong> {recipe.cooking_time} хвилин
        </span>
      </div>

      {recipe.description && (
        <div className={styles.recipeDescription}>
          <p>{recipe.description}</p>
        </div>
      )}

      <div className={styles.recipeSection}>
        <h2 className={styles.sectionTitle}>Інгредієнти</h2>
        {formatIngredients()}
      </div>

      <div className={styles.recipeSection}>
        <h2 className={styles.sectionTitle}>Інструкції</h2>
        {formatInstructions()}
      </div>
    </div>
  );
};

export default RecipePage;
