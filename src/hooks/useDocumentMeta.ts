import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Keeps document language, title, and meta description in sync with i18n.
 */
export function useDocumentMeta(): void {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.title = t('meta.title');

    const description = t('meta.description');
    let meta = document.querySelector('meta[name="description"]');

    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }

    meta.setAttribute('content', description);
  }, [t, i18n.language]);
}
