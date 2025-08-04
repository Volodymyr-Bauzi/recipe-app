import type {TranslationKeys} from '../types/translations';
import {enTranslations} from './en';
import {esTranslations} from './es';
import {krTranslations} from './kr';
import {ukrTranslations} from './ukr';

export type AvailableLanguageCode = 'ukr' | 'en' | 'kr' | 'es';

export interface LanguageOption {
  code: AvailableLanguageCode | string;
  label: string;
}

export const translations: Record<AvailableLanguageCode, TranslationKeys> = {
  en: enTranslations,
  ukr: ukrTranslations,
  kr: krTranslations,
  es: esTranslations,
};

export const availableLanguages: LanguageOption[] = [
  {code: 'ukr', label: 'Українська'},
  {code: 'en', label: 'English'},
  {code: 'kr', label: '한국어'},
  {code: 'es', label: 'Español'},
];
