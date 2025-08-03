import React, {createContext} from 'react';
import type {ReactNode} from 'react';
import {enTranslations} from '../translations/en';
import {ukrTranslations} from '../translations/ukr';
import type {TranslationKeys} from '../types/translations';
import {krTranslations} from '../translations/kr';
import {esTranslations} from '../translations/es'; // Assuming you have an esTranslations file

type TFunction = (key: string, params?: Record<string, string>) => string;

interface TranslationContextType {
  t: TFunction;
  locale: string;
  setLocale: (locale: string) => void;
}

export const TranslationContext = createContext<TranslationContextType | null>(
  null
);

interface TranslationProviderProps {
  children: ReactNode;
  locale?: string;
}

const getTranslations = (locale: string): TranslationKeys => {
  switch (locale) {
    case 'en':
      return enTranslations;
    case 'kr':
      return krTranslations;
    case 'ukr':
      return ukrTranslations;
    case 'es':
      return esTranslations;
    default:
      return ukrTranslations;
  }
};

export const TranslationProvider = ({
  children,
  locale = 'ukr',
}: TranslationProviderProps) => {
  const [currentLocale, setCurrentLocale] = React.useState(locale);
  const translations = getTranslations(currentLocale);

  const t: TFunction = (key, params) => {
    let translation = translations[key as keyof TranslationKeys] || key;

    // Замінюємо параметри типу {{param}}
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        translation = translation.replace(`{{${paramKey}}}`, value);
      });
    }

    return translation;
  };

  return (
    <TranslationContext.Provider
      value={{
        t,
        locale: currentLocale,
        setLocale: setCurrentLocale,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};
