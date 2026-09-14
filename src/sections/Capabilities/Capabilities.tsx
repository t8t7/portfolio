import { useLocale } from '@/hooks';
import { Section } from '@/components/common/Section';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Stagger, StaggerItem } from '@/components/common/Reveal';

interface CapabilityCard {
  title: string;
  description: string;
}

export function Capabilities() {
  const { t, tArray } = useLocale();
  const items = tArray<CapabilityCard>('capabilities.items');

  return (
    <Section id="capabilities" className="bg-ink-raised/40">
      <SectionHeading
        eyebrow={t('capabilities.eyebrow')}
        title={t('capabilities.title')}
        description={t('capabilities.description')}
      />
      <Stagger className="grid gap-px overflow-hidden rounded-sm border border-ink-line bg-ink-line sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <StaggerItem key={`${item.title}-${index}`} className="bg-ink-soft p-6 sm:p-7">
            <p className="mb-5 font-display text-4xl font-semibold text-accent/55" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </p>
            <h3 className="font-display text-xl font-semibold text-chalk">{item.title}</h3>
            <p className="list-readable mt-3">{item.description}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
