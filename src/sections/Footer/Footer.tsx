import { useTranslation } from 'react-i18next';
import { navigation, socialLinks } from '@/data/portfolio';
import { scrollToSection } from '@/utils';
import { SocialLinks } from '@/components/ui/SocialLinks';

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink-line bg-ink-raised/60 pb-10 pt-16">
      <div className="container-page">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr] md:gap-8">
          <div>
            <p className="font-display text-2xl font-semibold tracking-tight text-chalk">
              {t('profile.name')}
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-fog">
              {t('footer.note')}
            </p>
            <SocialLinks links={socialLinks} className="mt-8" />
          </div>

          <div className="grid grid-cols-2 gap-8 sm:justify-self-end">
            <div>
              <p className="mb-4 text-xs uppercase tracking-[0.2em] text-fog">
                {t('footer.navigate')}
              </p>
              <ul className="space-y-2">
                {navigation.slice(0, 4).map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      className="text-sm text-mist transition-colors hover:text-accent-soft"
                    >
                      {t(`nav.${item.id}`)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-xs uppercase tracking-[0.2em] text-fog">
                {t('footer.more')}
              </p>
              <ul className="space-y-2">
                {navigation.slice(4).map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      className="text-sm text-mist transition-colors hover:text-accent-soft"
                    >
                      {t(`nav.${item.id}`)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-ink-line pt-8 text-xs text-fog sm:flex-row sm:items-center sm:justify-between">
          <p>
            {t('footer.rights', {
              year,
              name: t('profile.name'),
            })}
          </p>
          <p className="tracking-[0.14em] uppercase">{t('profile.title')}</p>
        </div>
      </div>
    </footer>
  );
}
