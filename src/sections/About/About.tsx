import { useLocale } from '@/hooks';
import { Section } from '@/components/common/Section';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Reveal } from '@/components/common/Reveal';

export function About() {
  const { t, tList } = useLocale();
  const paragraphs = tList('about.paragraphs');

  return (
    <Section id="about" className="bg-ink-raised/40">
      <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
        <SectionHeading eyebrow={t('about.eyebrow')} title={t('about.headline')} />
        <div className="measure-readable space-y-6">
            {paragraphs.map((paragraph, index) => (
              <Reveal key={`about-paragraph-${index}`}>
                <p className="copy-readable">{paragraph}</p>
              </Reveal>
            ))}
        </div>
      </div>
    </Section>
  );
}
