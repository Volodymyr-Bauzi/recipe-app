import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import type {Recipe} from '../../types';
import styles from './RecipePage.module.css';
import PageWrapper from '../PageWrapper/PageWrapper';
import {supabase} from '../../lib/supabaseClient';
import RecipeModal from '../RecipeModal';
import type {User} from '@supabase/supabase-js';

const RecipePage: React.FC = () => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const {id} = useParams<{id: string}>();

  // These are dummy states just to satisfy PageWrapper props
  const emptySetRecipes = () => {};
  const [searchQuery] = useState('');
  const [selectedCategory] = useState<string | null>(null);

  // Check if the current user is the owner of the recipe
  const [isOwner, setIsOwner] = useState(false);

  // Fetch the current user
  useEffect(() => {
    const fetchUser = async () => {
      const {data} = await supabase.auth.getUser();
      setUser(data.user);
    };

    fetchUser();
  }, []);

  // Fetch the specific recipe
  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) {
        setError('No recipe ID provided');
        setLoading(false);
        return;
      }

      try {
        const {data, error} = await supabase
          .from('recipes')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setRecipe(data);
          // Check if the current user is the owner of this recipe
          if (user && data.user_id === user.id) {
            setIsOwner(true);
          }
        } else {
          setError('Recipe not found');
        }
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError('Failed to load recipe');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, user]);

  // Handle recipe update
  const handleRecipeUpdated = async () => {
    setLoading(true);
    try {
      const {data, error} = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setRecipe(data);
      }
    } catch (err) {
      console.error('Error refreshing recipe:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format ingredients as a list if they contain line breaks
  const formatIngredients = () => {
    if (!recipe?.ingredients) return <p>Інгредієнти не вказані.</p>;

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
    if (!recipe?.instructions) return <p>Інструкції не надані.</p>;

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
    <PageWrapper
      setRecipes={emptySetRecipes}
      searchQuery={searchQuery}
      selectedCategory={selectedCategory}
    >
      <div className={styles.recipePageContainer}>
        <Link to="/" className={styles.backButton}>
          ← Назад до рецептів
        </Link>

        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : error || !recipe ? (
          <div className={styles.error}>{error || 'Recipe not found'}</div>
        ) : (
          <div className={styles.recipePage}>
            <div className={styles.recipeHeader}>
              <h1 className={styles.recipeTitle}>{recipe.title}</h1>

              {isOwner && (
                <button
                  className={styles.editButton}
                  onClick={() => setIsEditModalOpen(true)}
                >
                  Редагувати
                </button>
              )}
            </div>

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
        )}

        {/* Edit Recipe Modal */}
        <RecipeModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={user}
          recipeToEdit={recipe}
          onRecipeUpdated={handleRecipeUpdated}
        />
      </div>
    </PageWrapper>
  );
};

export default RecipePage;
