// ukr.ts
import type {TranslationKeys} from '../types/translations';

export const ukrTranslations: TranslationKeys = {
  'recipe.viewDetails': 'Переглянути деталі рецепту: {{title}}',
  'recipe.minutes': 'хв',
  'recipe.ingredients': 'Інгредієнти',
  'recipe.noIngredients': 'Немає інгредієнтів',
  'recipe.title': 'Рецепти',
  'recipe.noResults': 'Рецептів не знайдено',
  'recipe.add': 'Додати рецепт',
  'recipe.edit': 'Редагувати рецепт',
  'recipe.enterTitle': 'Введіть назву рецепту',

  'search.placeholder': 'Шукати рецепт...',
  'search.noResults': 'Немає результатів для "{{query}}"',

  'recipe.form.title.label': 'Назва рецепту',
  'recipe.form.title.placeholder': 'Введіть назву рецепту',
  'recipe.form.category.label': 'Категорія',
  'recipe.form.category.placeholder': 'Виберіть категорію',
  'recipe.form.description.label': 'Опис',
  'recipe.form.description.placeholder': 'Короткий опис рецепту',
  'recipe.form.ingredients.label': 'Інгредієнти',
  'recipe.form.ingredients.placeholder':
    'Введіть інгредієнти (по одному на рядок)',
  'recipe.form.instructions.label': 'Інструкції',
  'recipe.form.instructions.placeholder': 'Введіть інструкції з приготування',
  'recipe.form.cookingTime.label': 'Час приготування (хвилини)',
  'recipe.form.cookingTime.placeholder': 'Введіть час приготування в хвилинах',
  'recipe.form.button.cancel': 'Скасувати',
  'recipe.form.button.add': 'Додати рецепт',
  'recipe.form.button.update': 'Оновити рецепт',
  'recipe.form.button.adding': 'Додавання...',
  'recipe.form.button.updating': 'Оновлення...',

  'recipe.backToList': 'Назад до рецептів',
  'recipe.loading': 'Завантаження...',
  'recipe.error': 'Сталася помилка',
  'recipe.notFound': 'Рецепт не знайдено',
  'recipe.delete': 'Видалити рецепт',
  'recipe.category.label': 'Категорія:',
  'recipe.cookingTime.label': 'Час приготування:',
  'recipe.ingredients.title': 'Інгредієнти:',
  'recipe.instructions.title.short': 'Інструкції',
  'recipe.instructions.title.full': 'Інструкції з приготування:',
  'recipe.minutes.full': 'хвилин',

  'header.title': 'Домашні Рецепти',
  'header.addRecipe': 'Додати новий рецепт',
  'header.loginToAdd': 'Увійдіть, щоб додати рецепт',
  'header.loginOrRegister': 'Увійти / Зареєструватися',
  'header.logout': 'Вийти',
  'header.userAvatarAlt': 'Аватар користувача',

  'footer.title': 'Смачні Рецепти',
  'footer.rights': 'Всі права захищені',

  'fontSizeChanger.changeFontSize': 'Змінити розмір шрифту',

  'modal.deleteRecipe.title': 'Видалити рецепт',
  'modal.deleteRecipe.description':
    'Ви впевнені, що хочете видалити цей рецепт? Цю дію неможливо скасувати.',
  'modal.cancel': 'Скасувати',
  'modal.delete': 'Видалити',

  'categories.title': 'Категорії', // New key for category title
  'categories.all': 'Всі категорії',
  'categories.desserts': 'Десерти',
  'categories.mainDishes': 'Основні страви',
  'categories.salads': 'Салати',
  'categories.soups': 'Супи',
  'categories.beverages': 'Напої',
  'categories.snacks': 'Закуски',
  'categories.baking': 'Випічка',
  'categories.meats': "М'ясні страви",
  'categories.preserves': 'Закрутки',
  'categories.sides': 'Гарніри',
  'categories.pizza': 'Піца',
};
