import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { navigation } from '@/data/portfolio';
import { useScrolled } from '@/hooks';
import { scrollToSection, cn } from '@/utils';
import { Button } from '@/components/ui/Button';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

export function Navbar() {
  const { t } = useTranslation();
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const onNavigate = (id: string) => {
    setOpen(false);
    scrollToSection(id);
  };

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500',
        scrolled || open
          ? 'border-b border-ink-line/80 bg-ink/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
        <button
          type="button"
          onClick={() => scrollToSection('hero')}
          className="font-display text-sm font-semibold tracking-[0.2em] uppercase text-chalk transition-colors hover:text-accent-soft"
        >
          {t('profile.firstName')}
        </button>

        <nav className="hidden items-center gap-8 lg:flex" aria-label={t('nav.primary')}>
          {navigation.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className="text-[0.8rem] font-medium uppercase tracking-[0.18em] text-fog transition-colors hover:text-chalk"
            >
              {t(`nav.${item.id}`)}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <LanguageSwitcher />
          <Button
            variant="secondary"
            className="!px-4 !py-2 text-xs uppercase tracking-[0.16em]"
            onClick={() => onNavigate('contact')}
          >
            {t('nav.contactCta')}
          </Button>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-ink-line text-chalk"
            aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{t('nav.menu')}</span>
            <div className="flex w-4 flex-col gap-1.5">
              <span
                className={cn(
                  'h-px w-full bg-current transition-transform duration-300',
                  open && 'translate-y-[3.5px] rotate-45',
                )}
              />
              <span
                className={cn(
                  'h-px w-full bg-current transition-opacity duration-300',
                  open && 'opacity-0',
                )}
              />
              <span
                className={cn(
                  'h-px w-full bg-current transition-transform duration-300',
                  open && '-translate-y-[3.5px] -rotate-45',
                )}
              />
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="border-t border-ink-line bg-ink/95 backdrop-blur-xl lg:hidden"
          >
            <nav className="container-page flex flex-col gap-1 py-6" aria-label={t('nav.mobile')}>
              {navigation.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className="rounded-sm px-2 py-3 text-left font-display text-xl text-chalk"
                >
                  {t(`nav.${item.id}`)}
                </button>
              ))}
              <Button className="mt-4" onClick={() => onNavigate('contact')}>
                {t('nav.getInTouch')}
              </Button>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
