// types/translations.ts
export interface TranslationKeys {
  'recipe.viewDetails': string;
  'recipe.minutes': string;
  'recipe.ingredients': string;
  'recipe.noIngredients': string;
  'recipe.title': string;
  'recipe.noResults': string;
  'recipe.add': string;
  'recipe.edit': string;
  'recipe.enterTitle': string;

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
  'header.settings': string;
  'header.loginToAdd': string;
  'header.loginOrRegister': string;
  'header.logout': string;
  'header.userAvatarAlt': string;

  'footer.title': string;
  'footer.rights': string;

  'fontSizeChanger.changeFontSize': string;

  'modal.deleteRecipe.title': string;
  'modal.deleteRecipe.description': string;
  'modal.cancel': string;
  'modal.delete': string;

  'categories.title': string;
  'categories.all': string;
  'categories.desserts': string;
  'categories.mainDishes': string;
  'categories.salads': string;
  'categories.soups': string;
  'categories.beverages': string;
  'categories.snacks': string;
  'categories.baking': string;
  'categories.meats': string;
  'categories.preserves': string;
  'categories.sides': string;
  'categories.pizza': string;

  'auth.signInTitle': string;
  'auth.signUpTitle': string;
  'auth.googleButton': string;
  'auth.or': string;
  'auth.emailPlaceholder': string;
  'auth.passwordPlaceholder': string;
  'auth.signInButton': string;
  'auth.signUpButton': string;
  'auth.noAccount': string;
  'auth.haveAccount': string;
  'auth.registerLink': string;
  'auth.loginLink': string;
  'auth.successMessage': string;
}

export interface LanguageOption {
  code: string;
  label: string;
  flag: string;
}

export type TranslationRecord = Record<keyof TranslationKeys, string>;
