import {useContext} from 'react';
import {TranslationContext} from '../contexts/TranslationContext';

// Базовий hook для перекладів
export const useTranslation = () => {
  const context = useContext(TranslationContext);

  if (!context) {
    // Fallback якщо контекст не знайдено
    return {
      t: (key: string) => {
        console.warn(`Translation missing for key: ${key}`);
        return key;
      },
      locale: 'ukr',
      setLocale: () => {},
      availableLanguages: [],
    };
  }

  return context;
};
