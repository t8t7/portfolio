import { useTranslation } from 'react-i18next';
import { profileMeta } from '@/data/portfolio';
import { Section } from '@/components/common/Section';
import { Reveal } from '@/components/common/Reveal';
import { Button } from '@/components/ui/Button';

export function Resume() {
  const { t } = useTranslation();

  return (
    <Section id="resume" className="bg-ink-raised/40">
      <Reveal>
        <div className="relative overflow-hidden border border-ink-line bg-[linear-gradient(135deg,rgba(194,164,107,0.12),rgba(14,16,19,0.9)_42%,rgba(7,8,9,0.95))] px-8 py-12 sm:px-12 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 top-0 h-56 w-56 rounded-full bg-accent/10 blur-3xl"
          />
          <div className="relative grid gap-8 md:grid-cols-[1.4fr_auto] md:items-end">
            <div>
              <p className="meta-readable mb-4 font-medium uppercase text-accent">
                {t('resume.eyebrow')}
              </p>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-chalk sm:text-4xl">
                {t('resume.title')}
              </h2>
              <p className="copy-readable measure-readable mt-4">
                {t('resume.description')}
              </p>
            </div>

            <Button
              href={profileMeta.resumeUrl}
              className="justify-self-start md:justify-self-end"
              as="a"
              download="Anton_Fedotov_Resume.pdf"
            >
              {t('resume.download')}
              <span aria-hidden="true">↓</span>
            </Button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
