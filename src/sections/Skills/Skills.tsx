import { useLocale } from '@/hooks';
import { skillsMeta } from '@/data/portfolio';
import { Section } from '@/components/common/Section';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Stagger, StaggerItem } from '@/components/common/Reveal';
import { cn } from '@/utils';

export function Skills() {
  const { t, tList } = useLocale();

  return (
    <Section id="skills" className="bg-ink-raised/40">
      <SectionHeading
        eyebrow={t('skills.eyebrow')}
        title={t('skills.title')}
        description={t('skills.description')}
      />

      <Stagger className="grid gap-px overflow-hidden border border-ink-line bg-ink-line sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {skillsMeta.map((category) => {
          const skills = tList(`skills.categories.${category.id}.skills`);
          return (
            <StaggerItem key={category.id} className="space-y-5 bg-ink-soft p-6">
              <h3 className="font-display text-xl font-semibold text-chalk">
                {t(`skills.categories.${category.id}.title`)}
              </h3>

              <ul className="space-y-3">
                {skills.map((skill, index) => {
                  const isPrimary =
                    Boolean(category.primarySkill) &&
                    skill === category.primarySkill;

                  return (
                    <li
                      key={`skills-${category.id}-${index}`}
                      className="list-readable flex gap-3"
                    >
                      <span
                        className={cn(
                          'mt-2 h-1 w-1 shrink-0 rounded-full',
                          isPrimary ? 'bg-accent' : 'bg-accent/80',
                        )}
                        aria-hidden="true"
                      />
                      <span
                        className={cn(
                          isPrimary
                            ? 'font-medium text-accent-soft'
                            : 'text-mist',
                        )}
                      >
                        {skill}
                      </span>
                    </li>
                  );
                })}
              </ul>

            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}
