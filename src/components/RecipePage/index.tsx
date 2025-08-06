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
import {useAuth} from './hooks/useAuth';
import s from './RecipePage.module.css';

const RecipePage: React.FC = () => {
  const {id} = useParams<{id: string}>();
  const navigate = useNavigate();
  const {t} = useTranslation();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {user} = useAuth();
  const {recipe, loading, error, refetchRecipe} = useRecipe(id, user);

  // Check if current user is admin using environment variable
  const isAdmin = user?.id === process.env.REACT_APP_SUPABASE_ADMIN_USER_ID;

  // Dummy states for PageWrapper compatibility
  const emptySetRecipes = () => {};
  const [searchQuery] = useState('');
  const [selectedCategory] = useState<string | null>(null);

  const canModify = Boolean(
    user && recipe && (recipe.user_id === user.id || isAdmin)
  );

  const handleDeleteRecipe = async () => {
    if (!id || !user) return;

    // Debug logging to check admin status
    console.log('Current user ID:', user.id);
    console.log(
      'Admin user ID from env:',
      process.env.REACT_APP_SUPABASE_ADMIN_USER_ID
    );
    console.log('Is admin:', isAdmin);
    console.log('Recipe owner ID:', recipe?.user_id);

    try {
      const deleteQuery = supabase.from('recipes').delete().eq('id', id);

      // Only add user_id filter if user is NOT admin
      if (!isAdmin) {
        deleteQuery.eq('user_id', user.id);
        console.log('Adding user_id filter for non-admin user');
      } else {
        console.log('Admin user - no user_id filter applied');
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {data, error, count} = await deleteQuery; // suppress unused variable warning

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // Check if the recipe was actually deleted
      if (count === 0) {
        console.error('Recipe was not deleted - count is 0');
        alert(
          'Failed to delete recipe. This might be due to database permissions (RLS policies).'
        );
        return;
      }

      console.log('Recipe deleted successfully, count:', count);
      navigate('/');
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error deleting recipe:', error.message);
        alert('An error occurred while deleting the recipe: ' + error?.message);
      } else {
        console.error('Error deleting recipe:', error);
      }
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  if (loading) {
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
