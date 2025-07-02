// src/api/comments.ts
import {supabase} from '../lib/supabaseClient';

export async function addComment(data: {
  recipe_id: string;
  user_id: string;
  content: string;
}) {
  return await supabase.from('comments').insert([data]);
}

export async function getCommentsForRecipe(recipe_id: string) {
  return await supabase
    .from('comments')
    .select('*')
    .eq('recipe_id', recipe_id)
    .order('created_at', {ascending: true});
}
