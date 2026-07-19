import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import {
  DEFAULT_LANGUAGE,
  getStoredLanguage,
  LANGUAGE_STORAGE_KEY,
  persistLanguage,
  type AppLanguage,
} from './config';
import en from '@/locales/en/common.json';
import ru from '@/locales/ru/common.json';

void i18n.use(initReactI18next).init({
  resources: {
    ru: { common: ru },
    en: { common: en },
  },
  lng: getStoredLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  defaultNS: 'common',
  ns: ['common'],
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
});

i18n.on('languageChanged', (language) => {
  const next = language as AppLanguage;
  persistLanguage(next);
  document.documentElement.lang = next;
});

document.documentElement.lang = i18n.language;

export function changeLanguage(language: AppLanguage): Promise<void> {
  persistLanguage(language);
  return i18n.changeLanguage(language).then(() => undefined);
}

export { LANGUAGE_STORAGE_KEY };
export default i18n;
