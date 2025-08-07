// src/components/RecipePage/RecipePage.tsx
import React, {useState} from 'react';
import {Link, useParams, useNavigate} from 'react-router-dom';
import {supabase} from '../../lib/supabaseClient';
import {useTranslation} from '../../hooks/useTranslation';
import PageWrapper from '../PageWrapper/PageWrapper';
import RecipeModal from '../RecipeModal';
import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal';
import RecipeHeader from './RecipeHeader';
import RecipeInfo from './RecipeInfo';
import RecipeContent from './RecipeContent';
import {useRecipe} from './hooks/useRecipe';
import s from './RecipePage.module.css';
import useSupabaseAuth from '../../hooks/useSupabaseAuth';

const RecipePage: React.FC = () => {
  const {id} = useParams<{id: string}>();
  const navigate = useNavigate();
  const {t} = useTranslation();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Use the updated useAuth hook
  const {user, isAdmin, loading: authLoading} = useSupabaseAuth();
  const {recipe, loading, error, refetchRecipe} = useRecipe(id, user);

  // Dummy states for PageWrapper compatibility
  const emptySetRecipes = () => {};
  const [searchQuery] = useState('');
  const [selectedCategory] = useState<string | null>(null);

  // User can modify if they own the recipe OR if they're an admin
  const canModify = Boolean(
    user && recipe && (recipe.user_id === user.id || isAdmin)
  );

  const handleDeleteRecipe = async () => {
    if (!id || !user) return;

    try {
      // Simple delete - RLS policies will handle the permissions
      const {error} = await supabase.from('recipes').delete().eq('id', id);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Recipe deleted successfully');
      navigate('/');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Failed to delete recipe. Please try again.');
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  // Show loading while checking auth or fetching recipe
  if (loading || authLoading) {
    return (
      <PageWrapper
        setRecipes={emptySetRecipes}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
      >
        <div className={s.recipePageContainer}>
          <div className={s.loading}>{t('recipe.loading')}</div>
        </div>
      </PageWrapper>
    );
  }

  if (error || !recipe) {
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
          <div className={s.error}>{error || t('recipe.notFound')}</div>
        </div>
      </PageWrapper>
    );
  }

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

        <div className={s.recipePage}>
          <RecipeHeader
            title={recipe.title}
            canModify={canModify}
            onEdit={() => setIsEditModalOpen(true)}
            onDelete={() => setIsDeleteModalOpen(true)}
          />

          {/* Show admin badge if user is admin */}
          {isAdmin && (
            <div
              style={{
                background: '#ff4444',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                marginBottom: '16px',
                width: 'fit-content',
              }}
            >
              ADMIN
            </div>
          )}

          <RecipeInfo
            category={recipe.category}
            cookingTime={recipe.cooking_time}
          />

          <RecipeContent
            description={recipe.description}
            ingredients={recipe.ingredients}
            instructions={recipe.instructions}
          />
        </div>

        <RecipeModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={user}
          recipeToEdit={recipe}
          onRecipeUpdated={refetchRecipe}
        />

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
