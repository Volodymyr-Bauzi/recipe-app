// src/api/ratings.ts
import {supabase} from '../lib/supabaseClient';

export async function rateRecipe(data: {
  recipe_id: string;
  user_id: string;
  rating: number;
}) {
  return await supabase
    .from('ratings')
    .upsert([data], {onConflict: 'recipe_id,user_id'});
}

export async function getRatingsForRecipe(recipe_id: string) {
  return await supabase
    .from('ratings')
    .select('rating')
    .eq('recipe_id', recipe_id);
}

export async function getAverageRating(recipe_id: string) {
  const {data, error} = await supabase
    .from('ratings')
    .select('rating')
    .eq('recipe_id', recipe_id);

  if (error) return {average: 0, count: 0};

  const count = data.length;
  const sum = data.reduce((acc, r) => acc + r.rating, 0);
  return {average: sum / count, count};
}
