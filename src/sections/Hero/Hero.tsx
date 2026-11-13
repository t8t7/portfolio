import { motion } from 'framer-motion';
import { useLocale } from '@/hooks';
import heroBackground640 from '@/assets/images/responsive/hero-background-640.webp';
import heroBackground1280 from '@/assets/images/responsive/hero-background-1280.webp';
import heroBackground1920 from '@/assets/images/responsive/hero-background-1920.webp';
import { socialLinks } from '@/data/portfolio';
import { Button } from '@/components/ui/Button';
import { SocialLinks } from '@/components/ui/SocialLinks';
import { scrollToSection } from '@/utils';
import { fadeIn, fadeUp, staggerContainer } from '@/utils/motion';

export function Hero() {
  const { t, tList } = useLocale();
  const stack = tList('hero.stack');

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
          src={heroBackground1280}
          srcSet={`${heroBackground640} 640w, ${heroBackground1280} 1280w, ${heroBackground1920} 1920w`}
          sizes="100vw"
          width={1920}
          height={1072}
          alt={t('hero.backgroundAlt')}
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
          <motion.p
            variants={fadeUp}
            className="meta-readable mb-4 font-medium uppercase text-accent-soft"
          >
            {t('profile.name')}
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="font-display text-xl font-semibold tracking-tight text-chalk/90 sm:text-2xl"
          >
            {t('profile.title')}
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="mt-5 max-w-4xl font-display text-[clamp(2.35rem,7vw,5rem)] font-bold leading-[1.04] tracking-tight text-chalk text-balance"
          >
            {t('hero.headline')}
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-6 max-w-[62ch] text-lg leading-relaxed text-mist sm:text-xl">
            {t('hero.description')}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8">
            <ul className="flex flex-wrap gap-2">
              {stack.map((technology) => (
                <li
                  key={technology}
                  className="border border-ink-line/90 bg-ink/30 px-3 py-1.5 text-sm text-mist backdrop-blur-sm"
                >
                  {technology}
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
            <Button
              variant="ghost"
              as="a"
              href="/resume/Anton_Fedotov_Resume.pdf"
              download
            >
              {t('hero.ctaResume')}
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
          onClick={() => scrollToSection('capabilities')}
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
