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

      <Stagger className="grid gap-10 md:grid-cols-3">
        {skillsMeta.map((category) => {
          const skills = tList(`skills.categories.${category.id}.skills`);
          const learning = category.hasLearning
            ? tList(`skills.categories.${category.id}.learning`)
            : [];
          const methods = category.hasMethods
            ? tList(`skills.categories.${category.id}.methods`)
            : [];

          return (
            <StaggerItem key={category.id} className="space-y-6">
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

              {learning.length > 0 ? (
                <div className="border-t border-ink-line pt-5">
                  <p className="meta-readable mb-3 font-medium uppercase text-fog">
                    {t(`skills.categories.${category.id}.learningLabel`)}
                  </p>
                  <ul className="space-y-3">
                    {learning.map((item, index) => (
                      <li
                        key={`skills-${category.id}-learning-${index}`}
                        className="list-readable flex gap-3 text-fog"
                      >
                        <span
                          className="mt-2 h-px w-2.5 shrink-0 bg-accent/70"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {methods.length > 0 ? (
                <div className="border-t border-ink-line pt-5">
                  <p className="meta-readable mb-3 font-medium uppercase text-fog">
                    {t(`skills.categories.${category.id}.methodsLabel`)}
                  </p>
                  <ul className="space-y-3">
                    {methods.map((item, index) => (
                      <li
                        key={`skills-${category.id}-methods-${index}`}
                        className="list-readable flex gap-3 text-fog"
                      >
                        <span
                          className="mt-2 h-px w-2.5 shrink-0 bg-accent/70"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}
