import {useContext} from 'react';
import {TranslationContext} from '../contexts/TranslationContext';

// Базовий hook для перекладів
export const useTranslation = () => {
  const context = useContext(TranslationContext);

  if (!context) {
    // Fallback якщо контекст не знайдено
    return {
      t: (key: string, params?: Record<string, string>) => {
        console.warn(`Translation missing for key: ${key}`, params);
        return key;
      },
    };
  }

  return context;
};
