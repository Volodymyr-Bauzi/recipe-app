// RecipePage/hooks/useRecipe.ts
import {useState, useEffect} from 'react';
import type {Recipe} from '../../../types';
import type {User} from '@supabase/supabase-js';
import {supabase} from '../../../lib/supabaseClient';

export const useRecipe = (id: string | undefined, user: User | null) => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

      if (error) throw error;

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

  const refetchRecipe = async () => {
    setLoading(true);
    await fetchRecipe();
  };

  useEffect(() => {
    fetchRecipe();
  }, [id, user]);

  return {recipe, loading, error, refetchRecipe};
};
