// types/translations.ts
export interface TranslationKeys {
  'recipe.viewDetails': string;
  'recipe.minutes': string;
  'recipe.ingredients': string;
  'recipe.noIngredients': string;
  'recipe.title'?: string; // Optional for languages that may not have this key
  'recipe.noResults'?: string; // Optional for languages that may not have this key

  'search.placeholder': string;
  'search.noResults': string;
}
