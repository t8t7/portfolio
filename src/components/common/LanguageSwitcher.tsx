import { useTranslation } from 'react-i18next';
import { changeLanguage } from '@/i18n';
import {
  LANGUAGE_LABELS,
  SUPPORTED_LANGUAGES,
  type AppLanguage,
  isAppLanguage,
} from '@/i18n/config';
import { cn } from '@/utils';

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation();
  const active = isAppLanguage(i18n.language) ? i18n.language : 'ru';

  const onSelect = (language: AppLanguage) => {
    if (language === active) return;
    void changeLanguage(language);
  };

  return (
    <div
      role="group"
      aria-label={t('language.switcherLabel')}
      className={cn(
        'inline-flex items-center gap-1 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-fog',
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
              'px-1.5 py-1 transition-colors duration-300',
              active === language
                ? 'text-accent-soft'
                : 'text-fog hover:text-chalk',
            )}
          >
            {t(`language.${language}`, { defaultValue: LANGUAGE_LABELS[language] })}
          </button>
        </span>
      ))}
    </div>
  );
}
