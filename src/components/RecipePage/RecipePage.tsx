import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import type {Recipe} from '../../types';
import s from './RecipePage.module.css';
import PageWrapper from '../PageWrapper/PageWrapper';
import {supabase} from '../../lib/supabaseClient';
import RecipeModal from '../RecipeModal';
import type {User} from '@supabase/supabase-js';
import {FaRegPenToSquare, FaRegTrashCan, FaStopwatch} from 'react-icons/fa6';
import {BiCategory} from 'react-icons/bi';
import {RiFileList3Line} from 'react-icons/ri';
import {GoChecklist} from 'react-icons/go';
import useWindowWidth from '../../hooks/useWindowWidth';
import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from '../../hooks/useTranslation';

const RecipePage: React.FC = () => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const {id} = useParams<{id: string}>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  const {t} = useTranslation();

  const isAdmin = user?.id === process.env.REACT_APP_SUPABASE_ADMIN_USER_ID;

  // These are dummy states just to satisfy PageWrapper props
  const emptySetRecipes = () => {};
  const [searchQuery] = useState('');
  const [selectedCategory] = useState<string | null>(null);

  // Check if the current user is the owner of the recipe
  const [canModify, setCanModify] = useState(false);

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
          const usercanModify = user && data.user_id === user.id;
          const userIsAdmin =
            user?.id === process.env.REACT_APP_SUPABASE_ADMIN_USER_ID;

          setCanModify(Boolean(usercanModify || userIsAdmin));
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
      <ul className={s.ingredientsList}>
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
      <ol className={s.instructionsList}>
        {steps.map((step, index) => (
          <li key={index}>{step.trim()}</li>
        ))}
      </ol>
    );
  };

  const handleDeleteRecipe = async () => {
    if (!id || !user) return;
    try {
      const {error} = await supabase
        .from('recipes')
        .delete()
        .eq('id', id)
        .eq(isAdmin ? 'id' : 'user_id', isAdmin ? id : user.id);
      if (error) {
        throw error;
      }
      navigate('/');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      setError('Failed to delete recipe');
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const width = useWindowWidth();

  return (
    <PageWrapper
      setRecipes={emptySetRecipes}
      searchQuery={searchQuery}
      selectedCategory={selectedCategory}
    >
      <div className={s.recipePageContainer}>
        <Link to="/" className={s.backButton}>
          {t('recipe.backToList')}
        </Link>

        {loading ? (
          <div className={s.loading}>{t('recipe.loading')}</div>
        ) : error || !recipe ? (
          <div className={s.error}>{error || t('recipe.notFound')}</div>
        ) : (
          <div className={s.recipePage}>
            <div className={s.recipeHeader}>
              <h1 className={s.recipeTitle}>{recipe.title}</h1>

              {canModify && (
                <>
                  <button
                    className={s.editButton}
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    <FaRegPenToSquare />
                    {t('recipe.edit')}
                  </button>
                  <button
                    className={`${s.editButton} ${s.deleteButton}`}
                    onClick={() => setIsDeleteModalOpen(true)}
                  >
                    <FaRegTrashCan />
                    {t('recipe.delete')}
                  </button>
                </>
              )}
            </div>

            <div className={s.recipeInfo}>
              <span className={s.recipeCategory}>
                <BiCategory />
                <strong>{t('recipe.category.label')}</strong>
                &nbsp;
                {recipe.category}
              </span>
              <span className={s.recipeCookingTime}>
                <FaStopwatch />
                <strong>{t('recipe.cookingTime.label')}</strong>
                &nbsp;
                {recipe.cooking_time} {t('recipe.minutes.full')}
              </span>
            </div>

            {recipe.description && (
              <div className={s.recipeDescription}>
                <p>{recipe.description}</p>
              </div>
            )}

            <div className={s.recipeSection}>
              <h2 className={s.sectionTitle}>
                <RiFileList3Line /> {t('recipe.ingredients.title')}:
              </h2>
              {formatIngredients()}
            </div>

            <div className={s.recipeSection}>
              <h2 className={s.sectionTitle}>
                <GoChecklist />
                {width < 426
                  ? t('recipe.instructions.title.short')
                  : t('recipe.instructions.title.full')}
              </h2>
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

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirmDelete={handleDeleteRecipe}
        />
      </div>
    </PageWrapper>
  );
};

export default RecipePage;
