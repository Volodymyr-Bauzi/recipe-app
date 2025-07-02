import {supabase} from '../lib/supabaseClient';

export async function getAllIngredients() {
  return await supabase.from('ingredients').select('*').order('name');
}
