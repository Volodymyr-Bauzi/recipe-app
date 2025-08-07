// src/api/recipes.ts
import {supabase} from '../lib/supabaseClient';

export async function createRecipe(data: {
  user_id: string;
  title: string;
  description: string;
  category?: string;
  ingredients?: string;
  instructions?: string;
  cooking_time?: number;
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
  data: Partial<{
    title: string;
    description: string;
    category: string;
    ingredients: string;
    instructions: string;
    cooking_time: number;
  }>
) {
  // RLS policies will handle whether user can update (owner or admin)
  return await supabase.from('recipes').update(data).eq('id', id);
}

export async function deleteRecipe(id: string) {
  // RLS policies will handle whether user can delete (owner or admin)
  return await supabase.from('recipes').delete().eq('id', id);
}

// Admin-specific functions
export async function getAllRecipesAsAdmin() {
  // This will work because admin has access to all recipes via RLS
  return await supabase
    .from('recipes')
    .select(
      `
      *,
      users:user_id (
        email
      )
    `
    )
    .order('created_at', {ascending: false});
}
