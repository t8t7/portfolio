import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { recommendationsMeta } from '@/data/portfolio';
import { Section } from '@/components/common/Section';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Stagger, StaggerItem } from '@/components/common/Reveal';
import { Button } from '@/components/ui/Button';
import { ImageLightbox, type LightboxImage } from '@/components/ui/ImageLightbox';
import { useLocale } from '@/hooks/useLocale';

export function Recommendations() {
  const { t } = useTranslation();
  const { tList } = useLocale();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const lightboxImages = useMemo((): LightboxImage[] => {
    const letter = recommendationsMeta.find((item) => item.id === activeId);
    if (!letter?.images?.length) return [];

    const company = t(`recommendations.items.${letter.id}.company`);
    return letter.images.map((src, pageIndex) => ({
      src,
      alt:
        letter.images!.length > 1
          ? `${company} — ${pageIndex + 1}/${letter.images!.length}`
          : company,
    }));
  }, [activeId, t]);

  const openLetter = (id: string) => {
    setActiveId(id);
    setLightboxIndex(0);
  };

  const closeLetter = () => {
    setLightboxIndex(null);
    setActiveId(null);
  };

  return (
    <Section id="recommendations">
      <SectionHeading
        eyebrow={t('recommendations.eyebrow')}
        title={t('recommendations.title')}
        description={t('recommendations.description')}
      />

      <Stagger className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        {recommendationsMeta.map((item) => {
          const points = tList(`recommendations.items.${item.id}.points`);

          return (
            <StaggerItem key={item.id}>
              <article className="flex h-full flex-col border border-ink-line bg-gradient-to-b from-ink-soft/85 to-ink/45 p-7 sm:p-8">
                <header className="border-b border-ink-line pb-5">
                  <p className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-accent">
                    {t('recommendations.documentLabel')}
                  </p>
                  <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-chalk sm:text-2xl">
                    {t(`recommendations.items.${item.id}.company`)}
                  </h3>
                  <p className="mt-2 text-sm text-fog sm:text-base">
                    {t(`recommendations.items.${item.id}.role`)}
                  </p>
                </header>

                <div className="mt-6 flex flex-1 flex-col">
                  <p className="text-base leading-relaxed text-mist">
                    {t(`recommendations.items.${item.id}.summary`)}
                  </p>

                  <p className="mt-6 text-xs font-medium uppercase tracking-[0.18em] text-fog/80">
                    {t('recommendations.confirmsLabel')}
                  </p>

                  <ul className="mt-3 space-y-2.5">
                    {points.map((point, index) => (
                      <li
                        key={`${item.id}-point-${index}`}
                        className="flex gap-3 text-sm leading-relaxed text-mist"
                      >
                        <span
                          className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-accent/70"
                          aria-hidden="true"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 border-t border-ink-line pt-6">
                  <Button
                    variant="secondary"
                    className="w-full sm:w-auto"
                    onClick={() => openLetter(item.id)}
                  >
                    {t('recommendations.openLetter')}
                  </Button>
                </div>
              </article>
            </StaggerItem>
          );
        })}
      </Stagger>

      <ImageLightbox
        images={lightboxImages}
        index={lightboxIndex}
        onClose={closeLetter}
        onIndexChange={setLightboxIndex}
      />
    </Section>
  );
}
