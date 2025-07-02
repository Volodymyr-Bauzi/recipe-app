import {supabase} from '../lib/supabaseClient';

export async function addIngredientToRecipe(data: {
  recipe_id: string;
  ingredient_id: string;
  quantity: string;
}) {
  return await supabase.from('recipe_ingredients').insert([data]);
}

export async function getIngredientsForRecipe(recipe_id: string) {
  return await supabase
    .from('recipe_ingredients')
    .select(
      `
      quantity,
      ingredients ( name )
    `
    )
    .eq('recipe_id', recipe_id);
}
