import { Link } from 'react-router-dom';
import { useLocale } from '@/hooks';
import { projectsMeta } from '@/data/portfolio';
import { getOpenProjectPath } from '@/api/openProfile';
import { Section } from '@/components/common/Section';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Stagger, StaggerItem } from '@/components/common/Reveal';
import { cn } from '@/utils';

function ProjectCta({
  projectId,
}: {
  projectId: string;
}) {
  const { t, i18n } = useLocale();
  const project = projectsMeta.find((item) => item.id === projectId);
  if (!project || project.cta.type === 'none') return null;

  const label = t(`projects.${project.cta.labelKey}`);
  const className =
    'text-sm font-medium text-accent-soft transition-colors hover:text-accent';

  if (project.cta.type === 'external' && project.cta.projectKey) {
    return (
      <a
        href={getOpenProjectPath(project.cta.projectKey)}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {label}
      </a>
    );
  }

  if (project.cta.type === 'internal' && project.cta.href) {
    const href = i18n.language === 'en' ? `/en${project.cta.href}` : project.cta.href;
    return (
      <Link to={href} className={className}>
        {label}
      </Link>
    );
  }

  return null;
}

export function Projects() {
  const { t } = useLocale();

  return (
    <Section id="projects">
      <SectionHeading
        eyebrow={t('projects.eyebrow')}
        title={t('projects.title')}
        description={t('projects.description')}
      />

      <Stagger className="grid gap-6 lg:grid-cols-2">
        {projectsMeta.map((project, index) => {
          return (
            <StaggerItem
              key={project.id}
              className={cn(
                'group border border-ink-line bg-ink-soft/60 p-7 transition-colors duration-500 hover:border-accent/35 sm:p-9',
                project.featured && index === 0 && 'lg:col-span-2 lg:grid lg:grid-cols-2 lg:gap-10',
              )}
            >
              <div>
                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-fog">
                  <span>{project.year}</span>
                  <span className="h-1 w-1 rounded-full bg-accent" aria-hidden="true" />
                  <span>{t(`projects.items.${project.id}.role`)}</span>
                </div>
                <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-chalk sm:text-3xl">
                  {t(`projects.items.${project.id}.title`)}
                </h3>
                <p className="copy-readable measure-readable mt-4">{t(`projects.items.${project.id}.summary`)}</p>
              </div>

              <div className={cn(project.featured && index === 0 && 'lg:pt-10')}>
                <dl className="mt-7 space-y-5 lg:mt-0">
                  {(['task', 'solution', 'result'] as const).map((field) => (
                    <div key={field} className="border-l border-accent/45 pl-4">
                      <dt className="meta-readable font-medium uppercase text-accent-soft">
                        {t(`projects.fields.${field}`)}
                      </dt>
                      <dd className="list-readable mt-1.5">{t(`projects.items.${project.id}.${field}`)}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-7">
                  <p className="meta-readable mb-3 font-medium uppercase text-fog">{t('projects.fields.deliverables')}</p>
                  <ul className="flex flex-wrap gap-2">
                    {project.deliverables.map((item) => (
                      <li key={item} className="border border-accent/25 bg-accent/5 px-3 py-1.5 text-xs text-mist">
                        {t(`projects.deliverables.${item}`)}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-7">
                  <p className="meta-readable mb-3 font-medium uppercase text-fog">{t('projects.fields.stack')}</p>
                  <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-ink-line px-3 py-1 text-xs text-fog"
                    >
                      {tag}
                    </span>
                  ))}
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <ProjectCta projectId={project.id} />
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}
