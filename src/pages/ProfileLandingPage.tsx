import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Reveal, Stagger, StaggerItem } from '@/components/common/Reveal';
import { Footer } from '@/sections/Footer';

type LandingPageId = 'pythonBackend' | 'engineeringDesign';

interface LandingPageContent {
  eyebrow: string;
  title: string;
  lead: string;
  proofTitle: string;
  proof: string[];
  workTitle: string;
  work: Array<{ title: string; description: string }>;
  projectsTitle: string;
  projects: Array<{ title: string; description: string; href: string }>;
  relatedLabel: string;
  relatedHref: string;
  relatedText: string;
  contactText: string;
  back: string;
}

export function ProfileLandingPage({ page }: { page: LandingPageId }) {
  const { t, i18n } = useTranslation();
  const content = t(`landingPages.${page}`, { returnObjects: true }) as LandingPageContent;
  const homePath = i18n.language === 'en' ? '/en/' : '/';

  return (
    <>
      <article className="section-pad">
        <div className="container-page max-w-5xl pt-8">
          <Reveal>
            <Link to={homePath} className="text-sm font-medium text-fog transition-colors hover:text-accent-soft">
              {content.back}
            </Link>
          </Reveal>

          <Reveal className="mt-10 border-b border-ink-line pb-12">
            <p className="meta-readable font-medium uppercase text-accent">{content.eyebrow}</p>
            <h1 className="mt-4 max-w-4xl font-display text-3xl font-semibold tracking-tight text-chalk sm:text-4xl md:text-[3rem] md:leading-[1.08]">
              {content.title}
            </h1>
            <p className="copy-readable measure-readable mt-6">{content.lead}</p>
          </Reveal>

          <Reveal className="mt-12">
            <h2 className="font-display text-2xl font-semibold text-chalk">{content.proofTitle}</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {content.proof.map((item) => (
                <li key={item} className="list-readable flex gap-3 border border-ink-line bg-ink-soft/50 p-5">
                  <span className="mt-2 h-px w-4 shrink-0 bg-accent" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <section className="mt-14" aria-labelledby={`${page}-work`}>
            <Reveal>
              <h2 id={`${page}-work`} className="font-display text-2xl font-semibold text-chalk">{content.workTitle}</h2>
            </Reveal>
            <Stagger className="mt-6 grid gap-4 sm:grid-cols-2">
              {content.work.map((item) => (
                <StaggerItem key={item.title} className="border border-ink-line bg-ink-soft/60 p-6">
                  <h3 className="font-display text-lg font-semibold text-chalk">{item.title}</h3>
                  <p className="list-readable mt-2">{item.description}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </section>

          <Reveal className="mt-14">
            <h2 className="font-display text-2xl font-semibold text-chalk">{content.projectsTitle}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {content.projects.map((project) => (
                <Link key={project.href} to={project.href} className="border border-ink-line p-6 transition-colors hover:border-accent/50">
                  <h3 className="font-display text-lg font-semibold text-chalk">{project.title}</h3>
                  <p className="list-readable mt-2">{project.description}</p>
                </Link>
              ))}
            </div>
          </Reveal>

          <Reveal className="mt-14 border border-ink-line bg-ink-raised/60 p-6 sm:p-8">
            <p className="meta-readable uppercase text-fog">{content.relatedLabel}</p>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Link to={content.relatedHref} className="font-display text-xl font-semibold text-chalk transition-colors hover:text-accent-soft">
                {content.relatedText}
              </Link>
              <Link to={`${homePath}#contact`} className="text-sm font-semibold uppercase tracking-[0.12em] text-accent-soft">
                {content.contactText}
              </Link>
            </div>
          </Reveal>
        </div>
      </article>
      <Footer />
    </>
  );
}
