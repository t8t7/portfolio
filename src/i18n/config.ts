export const SUPPORTED_LANGUAGES = ['ru', 'en'] as const;

export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: AppLanguage = 'ru';

export const LANGUAGE_STORAGE_KEY = 'portfolio-language';

export const LANGUAGE_LABELS: Record<AppLanguage, string> = {
  ru: 'RU',
  en: 'EN',
};

export function isAppLanguage(value: string): value is AppLanguage {
  return SUPPORTED_LANGUAGES.includes(value as AppLanguage);
}

export function getStoredLanguage(): AppLanguage {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE;
  }

  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored && isAppLanguage(stored)) {
    return stored;
  }

  return DEFAULT_LANGUAGE;
}

export function getInitialLanguage(): AppLanguage {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  if (window.location.pathname === '/en' || window.location.pathname.startsWith('/en/')) {
    return 'en';
  }
  return DEFAULT_LANGUAGE;
}

export function persistLanguage(language: AppLanguage): void {
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
}
