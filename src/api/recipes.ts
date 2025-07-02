// src/api/recipes.ts
import {supabase} from '../lib/supabaseClient';

export async function createRecipe(data: {
  user_id: string;
  title: string;
  description: string;
}) {
  return await supabase.from('recipes').insert([data]);
}

export async function getAllRecipes() {
  return await supabase
    .from('recipes')
    .select('*')
    .order('created_at', {ascending: false});
}

export async function getRecipeById(id: string) {
  return await supabase.from('recipes').select('*').eq('id', id).single();
}

export async function updateRecipe(
  id: string,
  data: Partial<{title: string; description: string}>
) {
  return await supabase.from('recipes').update(data).eq('id', id);
}

export async function deleteRecipe(id: string) {
  return await supabase.from('recipes').delete().eq('id', id);
}
