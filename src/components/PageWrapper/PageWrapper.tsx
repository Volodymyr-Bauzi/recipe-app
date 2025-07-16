import {useEffect, useState} from 'react';
import RecipeModal from '../RecipeModal/RecipeModal';
import Footer from '../Footer';
import Header from '../Header';
import s from './PageWrapper.module.css';
import {useSupabaseAuth} from '../../hooks/useSupabaseAuth';
import {supabase} from '../../lib/supabaseClient';
import type {Recipe} from '../../types';

interface PageWrapperProps {
  setRecipes: (recipes: Recipe[]) => void;
  searchQuery: string;
  selectedCategory: string | null;
  children: React.ReactNode;
}

const PageWrapper = ({
  setRecipes,
  searchQuery,
  selectedCategory,
  children,
}: PageWrapperProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {user} = useSupabaseAuth();
  const fetchRecipes = async () => {
    let query = supabase
      .from('recipes')
      .select('*')
      .order('created_at', {ascending: false});

    // Add search filter if query exists
    if (searchQuery) {
      query = query.ilike('title', `%${searchQuery}%`);
    }

    // Add category filter if selected
    if (selectedCategory) {
      query = query.eq('category', selectedCategory);
    }

    const {data, error} = await query;

    if (error) {
      console.error('Error fetching recipes:', error);
      return;
    }

    if (data) {
      setRecipes(data);
    }
  };

  const body = document.querySelector('body');

  const addRecipeButtonHandler = () => {
    if (!user) {
      // If no user is logged in, show an error message or redirect to login
      console.error('User not logged in');
      return;
    }
    if (body) {
      body.classList.add('modalOpen');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (body) {
      body.classList.remove('modalOpen');
    }
    setIsModalOpen(false);
  };

  // Load recipes when component mounts or when search/category changes
  useEffect(() => {
    fetchRecipes();
  }, [searchQuery, selectedCategory]);
  return (
    <div className={s.body}>
      <div className={s.content}>
        <Header onAddRecipeClick={addRecipeButtonHandler} />
        {children}
        <Footer />
      </div>

      <RecipeModal
        isOpen={isModalOpen}
        onClose={closeModal}
        user={user}
        onRecipeAdded={fetchRecipes}
      />
    </div>
  );
};
export default PageWrapper;
