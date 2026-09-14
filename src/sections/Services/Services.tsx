import { useLocale } from '@/hooks';
import { Section } from '@/components/common/Section';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Stagger, StaggerItem } from '@/components/common/Reveal';
import { Link } from 'react-router-dom';

interface ServiceItem {
  title: string;
  description: string;
  href?: string;
}

export function Services() {
  const { t, tArray } = useLocale();
  const items = tArray<ServiceItem>('services.items');

  return (
    <Section id="services" className="bg-ink-raised/40">
      <SectionHeading
        eyebrow={t('services.eyebrow')}
        title={t('services.title')}
        description={t('services.description')}
      />
      <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <StaggerItem key={`${item.title}-${index}`} className="border border-ink-line bg-ink-soft/60 p-6">
            <span className="mb-4 block h-px w-8 bg-accent" aria-hidden="true" />
            <h3 className="font-display text-lg font-semibold text-chalk">{item.title}</h3>
            <p className="list-readable mt-2">{item.description}</p>
            {item.href ? (
              <Link to={item.href} className="mt-4 inline-flex text-sm font-medium text-accent-soft hover:text-chalk">
                {t('services.details')}
              </Link>
            ) : null}
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
