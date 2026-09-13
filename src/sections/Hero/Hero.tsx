import { motion } from 'framer-motion';
import { useLocale } from '@/hooks';
import heroBackground from '@/assets/images/hero-background.webp';
import { socialLinks } from '@/data/portfolio';
import { Button } from '@/components/ui/Button';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { scrollToSection } from '@/utils';
import { fadeIn, fadeUp, staggerContainer } from '@/utils/motion';

export function Hero() {
  const { t, tList } = useLocale();
  const titles = tList('hero.titles');
  const description = tList('hero.description');
  const openTo = tList('hero.openTo');

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-end overflow-hidden pb-16 pt-28 md:items-center md:pb-24 md:pt-24"
    >
      <motion.div
        className="absolute inset-0"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
      >
        <img
          src={heroBackground}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,8,9,0.48)_0%,rgba(7,8,9,0.58)_45%,rgba(7,8,9,0.84)_100%)]" />
        <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(7,8,9,0.72)_0%,rgba(7,8,9,0.5)_40%,rgba(7,8,9,0.12)_68%,transparent_88%)] md:block" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(7,8,9,0.35)_100%)]" />
      </motion.div>

      <div className="container-page relative z-10 w-full">
        <motion.div
          className="max-w-3xl [text-shadow:0_1px_2px_rgba(0,0,0,0.72)]"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={fadeUp}
            className="font-display text-[clamp(2.75rem,8vw,5.5rem)] font-bold leading-[1.02] tracking-tight text-chalk"
          >
            {t('profile.name')}
          </motion.h1>

          <motion.ul
            variants={fadeUp}
            className="mt-6 flex flex-col gap-2 sm:gap-2.5"
          >
            {titles.map((title, index) => (
              <li
                key={`hero-title-${index}`}
                className="font-display text-lg font-medium leading-[1.4] tracking-tight text-chalk/90 sm:text-xl md:text-2xl"
              >
                {title}
              </li>
            ))}
          </motion.ul>

          <motion.div variants={fadeUp} className="mt-8 max-w-[65ch] space-y-5">
            {description.map((paragraph, index) => (
              <p
                key={`hero-description-${index}`}
                className="text-[1.0625rem] font-normal leading-[1.75] text-mist sm:text-lg sm:leading-[1.75]"
              >
                {paragraph}
              </p>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-accent-soft">
              {t('hero.openToLabel')}
            </p>
            <ul className="flex flex-wrap gap-2">
              {openTo.map((role, index) => (
                <li
                  key={`hero-open-to-${index}`}
                  className="border border-ink-line/90 bg-ink/30 px-3 py-1.5 text-sm text-mist backdrop-blur-sm"
                >
                  {role}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Button onClick={() => scrollToSection('projects')}>
              {t('hero.ctaPrimary')}
            </Button>
            <Button variant="secondary" onClick={() => scrollToSection('contact')}>
              {t('hero.ctaSecondary')}
            </Button>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-12">
            <SocialLinks links={socialLinks} />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <button
          type="button"
          onClick={() => scrollToSection('about')}
          className="flex flex-col items-center gap-2 text-xs uppercase tracking-[0.22em] text-mist transition-colors hover:text-chalk"
          aria-label={t('hero.scrollAria')}
        >
          {t('hero.scroll')}
          <span className="block h-8 w-px origin-top animate-pulse bg-accent/70" />
        </button>
      </motion.div>
    </section>
  );
}
