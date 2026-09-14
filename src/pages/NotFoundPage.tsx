import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function NotFoundPage() {
  const { t, i18n } = useTranslation();
  const homePath = i18n.language === 'en' ? '/en/' : '/';

  return (
    <section className="section-pad container-narrow min-h-[70svh] pt-32">
      <p className="meta-readable font-medium uppercase text-accent">404</p>
      <h1 className="mt-4 font-display text-4xl font-semibold text-chalk">
        {t('meta.routes.notFound.title')}
      </h1>
      <p className="copy-readable mt-5">{t('meta.routes.notFound.description')}</p>
      <Link className="mt-8 inline-flex text-accent-soft hover:text-accent" to={homePath}>
        {t('caseStudy.back')}
      </Link>
    </section>
  );
}
