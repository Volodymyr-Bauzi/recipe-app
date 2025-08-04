import React, {createContext, useMemo, useState} from 'react';
import type {ReactNode} from 'react';
import {translations, availableLanguages} from '../translations';
import type {AvailableLanguageCode} from '../translations';
import type {TranslationKeys} from '../types/translations';

type TFunction = (
  key: keyof TranslationKeys,
  params?: Record<string, string>
) => string;

interface TranslationContextType {
  t: TFunction;
  locale: AvailableLanguageCode;
  setLocale: (locale: AvailableLanguageCode) => void;
  availableLanguages: typeof availableLanguages;
}

export const TranslationContext = createContext<TranslationContextType | null>(
  null
);

interface TranslationProviderProps {
  children: ReactNode;
  locale?: AvailableLanguageCode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({
  children,
  locale = 'ukr',
}) => {
  const [currentLocale, setCurrentLocale] =
    useState<AvailableLanguageCode>(locale);

  // Memoize translations for current locale
  const currentTranslations = useMemo(
    () => translations[currentLocale],
    [currentLocale]
  );

  // Translation function
  const t: TFunction = (key, params) => {
    let translation = currentTranslations[key] || key;

    // Replace {{param}} with actual values
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
        availableLanguages,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};
