import DOMPurify from 'dompurify';

/**
 * Санітизує текст для безпечного відображення
 */
export const sanitizeText = (text: string | undefined | null): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  }).trim();
};

/**
 * Форматує інгредієнти з різних форматів в readable список
 */
export const formatIngredients = (
  ingredients: string | undefined | null
): string => {
  if (!ingredients || typeof ingredients !== 'string') {
    return '';
  }

  const cleanIngredients = ingredients
    .split(/[,\n;]/) // Розділяємо по комах, новим рядкам або крапкам з комою
    .map((ingredient) => ingredient.trim()) // Прибираємо зайві пробіли
    .filter((ingredient) => ingredient.length > 0) // Видаляємо порожні елементи
    .filter((ingredient) => ingredient !== '-') // Видаляємо дефіси-плейсхолдери
    .slice(0, 8); // Обмежуємо до 8 інгредієнтів для карточки

  if (cleanIngredients.length === 0) {
    return '';
  }

  // Якщо інгредієнтів багато, показуємо перші + "..."
  if (cleanIngredients.length >= 8) {
    return cleanIngredients.slice(0, 7).join(', ') + '...';
  }

  return cleanIngredients.join(', ');
};

/**
 * Валідує cooking_time та повертає безпечне значення
 */
export const formatCookingTime = (
  time: string | number | undefined | null
): string => {
  if (!time) return '';

  const numTime = typeof time === 'string' ? parseInt(time, 10) : time;

  if (isNaN(numTime) || numTime <= 0) return '';

  return numTime.toString();
};
