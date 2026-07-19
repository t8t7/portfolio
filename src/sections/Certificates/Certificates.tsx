import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { certificatesMeta } from '@/data/portfolio';
import type { CertificateMeta } from '@/types';
import { Section } from '@/components/common/Section';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Stagger, StaggerItem } from '@/components/common/Reveal';
import { Button } from '@/components/ui/Button';
import { ImageLightbox, type LightboxImage } from '@/components/ui/ImageLightbox';

function CertificateCard({
  certificate,
  onOpen,
}: {
  certificate: CertificateMeta;
  onOpen: () => void;
}) {
  const { t } = useTranslation();
  const base = `certificates.items.${certificate.id}`;

  return (
    <article className="flex h-full flex-col border border-ink-line bg-gradient-to-b from-ink-soft/85 to-ink/45 p-7 sm:p-8 md:p-10">
      <header className="border-b border-ink-line pb-6">
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-accent">
          {t('certificates.documentLabel')}
        </p>
        <h3 className="mt-3 whitespace-pre-line font-display text-2xl font-semibold tracking-tight text-chalk text-balance sm:text-3xl">
          {t(`${base}.title`)}
        </h3>
        <p className="mt-3 text-base text-fog">{t(`${base}.issuer`)}</p>
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.18em] text-fog/70">
            {t('certificates.dateLabel')}
          </p>
          <p className="mt-1 text-mist">{t(`${base}.date`)}</p>
        </div>
        <div className="hidden h-8 w-px bg-ink-line sm:block" aria-hidden="true" />
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.18em] text-fog/70">
            {t('certificates.statusLabel')}
          </p>
          <p className="mt-1 text-mist">{t(`${base}.status`)}</p>
        </div>
      </div>

      <p className="mt-6 max-w-2xl text-base leading-relaxed text-mist">
        {t(`${base}.description`)}
      </p>

      <ul className="mt-7 flex flex-wrap gap-2">
        {certificate.badges.map((badge) => (
          <li
            key={`${certificate.id}-${badge}`}
            className="border border-ink-line px-3 py-1.5 text-xs tracking-wide text-fog"
          >
            {badge}
          </li>
        ))}
      </ul>

      <div className="mt-8 border-t border-ink-line pt-6">
        <Button variant="secondary" onClick={onOpen}>
          {t('certificates.viewCertificate')}
        </Button>
      </div>
    </article>
  );
}

export function Certificates() {
  const { t } = useTranslation();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const lightboxImages = useMemo((): LightboxImage[] => {
    const certificate = certificatesMeta.find((item) => item.id === activeId);
    if (!certificate?.imageSrc) return [];

    return [
      {
        src: certificate.imageSrc,
        alt: t(`certificates.items.${certificate.id}.title`).replace(/\n/g, ' '),
      },
    ];
  }, [activeId, t]);

  const openCertificate = (id: string) => {
    setActiveId(id);
    setLightboxIndex(0);
  };

  const closeCertificate = () => {
    setLightboxIndex(null);
    setActiveId(null);
  };

  return (
    <Section id="certificates" className="bg-ink-raised/40">
      <SectionHeading
        eyebrow={t('certificates.eyebrow')}
        title={t('certificates.title')}
        description={t('certificates.description')}
      />

      <Stagger
        className={
          certificatesMeta.length === 1
            ? 'mx-auto max-w-3xl'
            : 'mx-auto grid max-w-5xl gap-6 md:grid-cols-2'
        }
      >
        {certificatesMeta.map((certificate) => (
          <StaggerItem key={certificate.id}>
            <CertificateCard
              certificate={certificate}
              onOpen={() => openCertificate(certificate.id)}
            />
          </StaggerItem>
        ))}
      </Stagger>

      <ImageLightbox
        images={lightboxImages}
        index={lightboxIndex}
        onClose={closeCertificate}
        onIndexChange={setLightboxIndex}
      />
    </Section>
  );
}
