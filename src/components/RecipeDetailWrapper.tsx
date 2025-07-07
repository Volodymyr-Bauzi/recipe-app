import {useState, useEffect} from 'react';
import {supabase} from '../lib/supabaseClient';
import s from './RecipeDetailWrapper.module.css';
import Footer from './Footer';
import Header from './Header';
import RecipePage from './RecipePage';
import type {Recipe} from '../types';
import {Link, useParams} from 'react-router-dom';

const RecipeDetailWrapper = () => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {id} = useParams<{id: string}>();

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;

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
  }, [id]);

  if (loading) {
    return <div className={s.loading}>Loading...</div>;
  }

  if (error || !recipe) {
    return <div className={s.error}>{error || 'Recipe not found'}</div>;
  }

  return (
    <div className={s.body}>
      <Header onAddRecipeClick={() => {}} />
      <div className={s.content}>
        <div className={s.recipePageContainer}>
          <Link to="/" className={s.backButton}>
            ← Назад до рецептів
          </Link>
          <RecipePage recipe={recipe} />
        </div>
        <Footer />
      </div>
    </div>
  );
};
export default RecipeDetailWrapper;
