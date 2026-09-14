import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { changeLanguage } from '@/i18n';
import {
  LANGUAGE_LABELS,
  SUPPORTED_LANGUAGES,
  type AppLanguage,
  isAppLanguage,
} from '@/i18n/config';
import { cn } from '@/utils';
import { getLocalizedPath } from '@/seo/config';

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const active = isAppLanguage(i18n.language) ? i18n.language : 'ru';

  const onSelect = (language: AppLanguage) => {
    if (language === active) return;
    void changeLanguage(language).then(() => {
      navigate({
        pathname: getLocalizedPath(location.pathname, language),
        hash: location.hash,
      });
    });
  };

  return (
    <div
      role="group"
      aria-label={t('language.switcherLabel')}
      className={cn(
        'inline-flex items-center gap-1 text-sm font-medium uppercase leading-none tracking-[0.08em] text-mist',
        className,
      )}
    >
      {SUPPORTED_LANGUAGES.map((language, index) => (
        <span key={language} className="inline-flex items-center gap-1">
          {index > 0 ? (
            <span className="text-ink-line" aria-hidden="true">
              |
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => onSelect(language)}
            aria-pressed={active === language}
            className={cn(
              'px-1.5 py-2 transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
              active === language
                ? 'text-accent-soft'
                : 'text-mist hover:text-chalk',
            )}
          >
            {t(`language.${language}`, { defaultValue: LANGUAGE_LABELS[language] })}
          </button>
        </span>
      ))}
    </div>
  );
}
