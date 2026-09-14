import { useLocale } from '@/hooks';
import { experienceMeta } from '@/data/portfolio';
import { Section } from '@/components/common/Section';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Reveal, Stagger, StaggerItem } from '@/components/common/Reveal';

interface ProfileCard {
  id: string;
  title: string;
  caption?: string;
  points: string[];
  learningLabel?: string;
  learning?: string[];
}

export function Experience() {
  const { t, tList, tArray } = useLocale();
  const profileCards = tArray<ProfileCard>('experience.profile.cards');
  const profileNote = t('experience.profile.note');

  return (
    <Section id="experience">
      <SectionHeading
        eyebrow={t('experience.eyebrow')}
        title={t('experience.title')}
        description={t('experience.description')}
      />

      <Reveal className="mb-12 md:mb-16">
        <div className="grid gap-px overflow-hidden rounded-sm border border-ink-line bg-ink-line md:grid-cols-3">
          {profileCards.map((card, cardIndex) => {
            const points = Array.isArray(card.points) ? card.points : [];
            const learning = Array.isArray(card.learning) ? card.learning : [];
            const cardKey = `experience-profile-${card.id || cardIndex}`;

            return (
              <article key={cardKey} className="bg-ink-soft p-6 sm:p-7">
                {card.caption ? (
                  <p className="meta-readable mb-2 font-medium uppercase text-accent-soft">
                    {card.caption}
                  </p>
                ) : null}
                <h3 className="font-display text-xl font-semibold tracking-tight text-chalk">
                  {card.title}
                </h3>
                <ul className="mt-4 space-y-2">
                  {points.map((point, pointIndex) => (
                    <li
                      key={`${cardKey}-point-${pointIndex}`}
                      className="list-readable flex gap-3"
                    >
                      <span
                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent"
                        aria-hidden="true"
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                {learning.length > 0 ? (
                  <div className="mt-4 border-t border-ink-line/80 pt-4">
                    <p className="meta-readable mb-2 font-medium uppercase text-fog">
                      {card.learningLabel}
                    </p>
                    <ul className="space-y-1.5">
                      {learning.map((item, learningIndex) => (
                        <li
                          key={`${cardKey}-learning-${learningIndex}`}
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
              </article>
            );
          })}
        </div>

        <p className="copy-readable mt-6 border border-accent/25 bg-accent-dim/40 px-5 py-4 sm:px-6 sm:py-5">
          {profileNote}
        </p>
      </Reveal>

      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-[0.55rem] top-2 w-px bg-gradient-to-b from-accent/70 via-ink-line to-transparent md:left-[0.7rem]"
        />

        <Stagger className="space-y-0">
          {experienceMeta.map((item) => {
            const responsibilities = tList(
              `experience.items.${item.id}.responsibilities`,
            );
            const location = t(`experience.items.${item.id}.location`);
            const hasLocation = Boolean(location && location.trim());
            const summary = t(`experience.items.${item.id}.summary`);

            return (
              <StaggerItem key={item.id}>
                <article className="relative grid gap-5 py-8 pl-10 md:grid-cols-[220px_1fr] md:gap-12 md:pl-14 lg:grid-cols-[260px_1fr]">
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-10 flex h-5 w-5 items-center justify-center rounded-full border border-accent/60 bg-ink"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  </span>

                  <div>
                    <p className="text-sm font-medium text-accent-soft">
                      {t(`experience.items.${item.id}.period`)}
                    </p>
                    <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-chalk md:text-2xl">
                      {t(`experience.items.${item.id}.company`)}
                    </h3>
                    {hasLocation ? (
                      <p className="mt-2 text-sm text-fog">{location}</p>
                    ) : null}
                    <p className="mt-3 text-sm font-medium tracking-wide text-mist">
                      {t(`experience.items.${item.id}.role`)}
                    </p>
                  </div>

                  <div>
                    <p className="copy-readable measure-readable mb-6">{summary}</p>
                    <p className="meta-readable mb-4 font-medium uppercase text-fog">
                      {t('experience.responsibilitiesLabel')}
                    </p>
                    <ul className="space-y-3">
                      {responsibilities.map((responsibility, index) => (
                        <li
                          key={`${item.id}-responsibility-${index}`}
                          className="list-readable flex gap-3"
                        >
                          <span
                            className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent"
                            aria-hidden="true"
                          />
                          <span>{responsibility}</span>
                        </li>
                      ))}
                    </ul>

                    {item.technologies.length > 0 ? (
                      <div className="mt-6">
                        <p className="meta-readable mb-3 font-medium uppercase text-fog">
                          {t('experience.technologiesLabel')}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {item.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="border border-ink-line px-3 py-1 text-xs tracking-wide text-fog"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>

      <Reveal>
        <div className="hairline mt-4" />
      </Reveal>
    </Section>
  );
}
