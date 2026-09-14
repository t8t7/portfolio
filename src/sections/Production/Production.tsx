import { useLocale } from '@/hooks';
import { Section } from '@/components/common/Section';
import { Reveal } from '@/components/common/Reveal';

export function Production() {
  const { t, tList } = useLocale();
  const skills = tList('production.skills');

  return (
    <Section id="production">
      <Reveal>
        <div className="relative overflow-hidden border border-accent/30 bg-ink-soft p-7 sm:p-10 lg:p-14">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
          <p className="meta-readable mb-4 font-medium uppercase text-accent">{t('production.eyebrow')}</p>
          <h2 className="max-w-4xl font-display text-3xl font-semibold tracking-tight text-chalk text-balance sm:text-4xl lg:text-5xl">
            {t('production.title')}
          </h2>
          <p className="copy-readable measure-readable mt-5">{t('production.description')}</p>
          <ul className="mt-8 flex flex-wrap gap-2 sm:gap-3">
            {skills.map((skill) => (
              <li key={skill} className="border border-ink-line bg-ink/50 px-4 py-2 text-sm font-medium text-mist">
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
