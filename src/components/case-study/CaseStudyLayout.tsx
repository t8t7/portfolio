import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Reveal, Stagger, StaggerItem } from '@/components/common/Reveal';
import { Footer } from '@/sections/Footer';
import { cn } from '@/utils';

export function CaseStudyShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isSandbox = location.pathname.endsWith('/projects/sandbox');
  const relatedProjectPath = i18n.language === 'en'
    ? isSandbox ? '/en/projects/ispring-testing' : '/en/projects/sandbox'
    : isSandbox ? '/projects/ispring-testing' : '/projects/sandbox';

  return (
    <>
      <div className={cn('section-pad', className)}>
        <div className="container-page max-w-5xl">
          <Reveal className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              to={i18n.language === 'en' ? '/en/#projects' : '/#projects'}
              className="inline-flex text-sm font-medium text-fog transition-colors hover:text-accent-soft"
            >
              {t('caseStudy.back')}
            </Link>
            <Link
              to={i18n.language === 'en' ? '/en/python-backend-developer' : '/python-backend-developer'}
              className="text-sm font-medium text-fog transition-colors hover:text-accent-soft"
            >
              Python Backend
            </Link>
            <Link
              to={i18n.language === 'en' ? '/en/engineer-designer' : '/engineer-designer'}
              className="text-sm font-medium text-fog transition-colors hover:text-accent-soft"
            >
              {t('services.items.3.title')}
            </Link>
            <Link
              to={relatedProjectPath}
              className="text-sm font-medium text-fog transition-colors hover:text-accent-soft"
            >
              {t(isSandbox ? 'caseStudy.ispring.title' : 'caseStudy.sandbox.title')}
            </Link>
          </Reveal>
          {children}
        </div>
      </div>
      <Footer />
    </>
  );
}

export function CaseStudyHeader({
  eyebrow,
  title,
  role,
  year,
}: {
  eyebrow: string;
  title: string;
  role: string;
  year: string;
}) {
  return (
    <Reveal className="mt-10 border-b border-ink-line pb-10">
      <p className="meta-readable font-medium uppercase text-accent">
        {eyebrow}
      </p>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-chalk sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">
        {title}
      </h1>
      <div className="mt-5 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-fog">
        <span>{year}</span>
        <span className="h-1 w-1 rounded-full bg-accent" aria-hidden="true" />
        <span>{role}</span>
      </div>
    </Reveal>
  );
}

export function CaseStudySection({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Reveal className={cn('mt-12', className)}>
      <h2 className="font-display text-xl font-semibold tracking-tight text-chalk sm:text-2xl">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </Reveal>
  );
}

export function CaseStudyList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="list-readable flex gap-3">
          <span className="mt-2 h-px w-4 shrink-0 bg-accent" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function CaseStudyTags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span key={tag} className="border border-ink-line px-3 py-1 text-xs text-fog">
          {tag}
        </span>
      ))}
    </div>
  );
}

export function CaseStudyPlaceholder({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex min-h-[140px] items-center justify-center border border-dashed border-ink-line bg-ink/40 px-6 py-10 text-center',
        className,
      )}
    >
      <p className="max-w-sm text-base leading-[1.7] text-fog">{label}</p>
    </div>
  );
}

export function CaseStudyGallery({
  count,
  label,
}: {
  count: number;
  label: string;
}) {
  return (
    <Stagger className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: count }, (_, index) => (
        <StaggerItem key={`gallery-${index}`}>
          <CaseStudyPlaceholder label={label} className="min-h-[180px]" />
        </StaggerItem>
      ))}
    </Stagger>
  );
}

export function CaseStudyNotice({ children }: { children: ReactNode }) {
  return (
    <Reveal className="mt-14 border border-ink-line bg-ink-soft/60 px-6 py-5 sm:px-8">
      <p className="copy-readable">{children}</p>
    </Reveal>
  );
}
