import type {TranslationKeys} from '../types/translations';
import {enTranslations} from './en';
import {esTranslations} from './es';
import {krTranslations} from './kr';
import {ukrTranslations} from './ukr';

export const translations: Record<string, TranslationKeys> = {
  en: enTranslations,
  ukr: ukrTranslations,
  kr: krTranslations,
  es: esTranslations,
};

export const availableLanguages = [
  {code: 'ukr', name: 'Українська'},
  {code: 'en', name: 'English'},
  {code: 'kr', name: '한국어'},
  {code: 'es', name: 'Español'},
];

export type AvailableLanguageCode = (typeof availableLanguages)[number]['code'];
