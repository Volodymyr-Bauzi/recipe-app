// types/translations.ts
export interface TranslationKeys {
  'recipe.viewDetails': string;
  'recipe.minutes': string;
  'recipe.ingredients': string;
  'recipe.noIngredients': string;
  'recipe.title'?: string; // Optional for languages that may not have this key
  'recipe.noResults'?: string; // Optional for languages that may not have this key
  'recipe.add'?: string; // Optional for languages that may not have this key
  'recipe.edit'?: string; // Optional for languages that may not have this key
  'recipe.enterTitle'?: string; // Optional for languages that may not have this key

  'search.placeholder': string;
  'search.noResults': string;

  'recipe.form.title.label': string;
  'recipe.form.title.placeholder': string;
  'recipe.form.category.label': string;
  'recipe.form.category.placeholder': string;
  'recipe.form.description.label': string;
  'recipe.form.description.placeholder': string;
  'recipe.form.ingredients.label': string;
  'recipe.form.ingredients.placeholder': string;
  'recipe.form.instructions.label': string;
  'recipe.form.instructions.placeholder': string;
  'recipe.form.cookingTime.label': string;
  'recipe.form.cookingTime.placeholder': string;
  'recipe.form.button.cancel': string;
  'recipe.form.button.add': string;
  'recipe.form.button.update': string;
  'recipe.form.button.adding': string;
  'recipe.form.button.updating': string;

  'recipe.backToList': string;
  'recipe.loading': string;
  'recipe.error': string;
  'recipe.notFound': string;
  'recipe.delete': string;
  'recipe.category.label': string;
  'recipe.cookingTime.label': string;
  'recipe.ingredients.title': string;
  'recipe.instructions.title.short': string;
  'recipe.instructions.title.full': string;
  'recipe.minutes.full': string;

  'header.title': string;
  'header.addRecipe': string;
  'header.loginToAdd': string;
  'header.loginOrRegister': string;
  'header.logout': string;
  'header.userAvatarAlt': string;
}
