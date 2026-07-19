import { useLocale } from '@/hooks';
import { Section } from '@/components/common/Section';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Reveal, Stagger, StaggerItem } from '@/components/common/Reveal';

interface AboutHighlight {
  label: string;
  value: string;
  stack?: string[];
}

interface SkillGroup {
  id: string;
  label: string;
  tags: string[];
}

export function About() {
  const { t, tList, tArray } = useLocale();
  const paragraphs = tList('about.paragraphs');
  const highlights = tArray<AboutHighlight>('about.highlights');
  const skillGroups = tArray<SkillGroup>('about.skillGroups');

  return (
    <Section id="about" className="bg-ink-raised/40">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div>
          <SectionHeading eyebrow={t('about.eyebrow')} title={t('about.headline')} />
          <div className="space-y-5">
            {paragraphs.map((paragraph, index) => (
              <Reveal key={`about-paragraph-${index}`}>
                <p className="text-base leading-relaxed text-fog sm:text-lg">{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-8">
            <div className="space-y-5">
              {skillGroups.map((group, groupIndex) => {
                const tags = Array.isArray(group.tags) ? group.tags : [];

                return (
                  <div key={`about-skill-group-${group.id || groupIndex}`}>
                    <p className="mb-2.5 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-fog">
                      {group.label}
                    </p>
                    <ul className="flex flex-wrap gap-2">
                      {tags.map((tag, tagIndex) => (
                        <li
                          key={`about-skill-group-${group.id || groupIndex}-tag-${tagIndex}`}
                          className="border border-ink-line px-3 py-1.5 text-xs tracking-wide text-fog"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>

        <Stagger className="grid grid-cols-2 gap-px self-start overflow-hidden rounded-sm border border-ink-line bg-ink-line">
          {highlights.map((item, index) => {
            const stack = Array.isArray(item.stack) ? item.stack : [];

            return (
              <StaggerItem
                key={`about-highlight-${index}`}
                className="bg-ink-soft p-6 sm:p-8"
              >
                <p className="whitespace-pre-line font-display text-2xl font-semibold tracking-tight text-chalk sm:text-3xl">
                  {item.value}
                </p>
                {stack.length > 0 ? (
                  <ul className="mt-3 space-y-1">
                    {stack.map((tech, techIndex) => (
                      <li
                        key={`about-highlight-${index}-tech-${techIndex}`}
                        className="text-sm leading-snug text-mist"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <p className="mt-3 whitespace-pre-line text-xs uppercase tracking-[0.2em] text-fog">
                  {item.label}
                </p>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </Section>
  );
}
