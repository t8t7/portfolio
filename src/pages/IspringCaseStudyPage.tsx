import { useMemo, useState } from 'react';
import { useLocale } from '@/hooks';
import { projectsMeta } from '@/data/portfolio';
import { distributeIspringMedia, ispringMedia } from '@/data/ispringMedia';
import {
  CaseStudyHeader,
  CaseStudyList,
  CaseStudyNotice,
  CaseStudySection,
  CaseStudyShell,
  CaseStudyTags,
} from '@/components/case-study/CaseStudyLayout';
import { EvidenceGallery } from '@/components/case-study/EvidenceGallery';
import { ImageLightbox } from '@/components/ui/ImageLightbox';

const ispringMeta = projectsMeta.find((item) => item.id === 'ispring-lms');

const GALLERY_SECTIONS = [
  'testCasesTitle',
  'checklistsTitle',
  'bugReportsTitle',
  'screenshotsTitle',
] as const;

export function IspringCaseStudyPage() {
  const { t, tList } = useLocale();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const groups = useMemo(() => distributeIspringMedia(GALLERY_SECTIONS.length), []);

  const lightboxImages = useMemo(
    () =>
      ispringMedia.map((item) => ({
        src: item.src,
        alt: t('caseStudy.evidenceAlt', { name: item.fileName }),
      })),
    [t],
  );

  return (
    <CaseStudyShell>
      <CaseStudyHeader
        eyebrow={t('caseStudy.ispring.eyebrow')}
        title={t('caseStudy.ispring.title')}
        role={t('caseStudy.ispring.role')}
        year={t('caseStudy.ispring.year')}
      />

      <CaseStudySection title={t('caseStudy.ispring.overviewTitle')}>
        <p className="copy-readable measure-readable whitespace-pre-line">
          {t('caseStudy.ispring.overview')}
        </p>
      </CaseStudySection>

      <CaseStudySection title={t('caseStudy.ispring.testedTitle')}>
        <CaseStudyList items={tList('caseStudy.ispring.tested')} />
      </CaseStudySection>

      <CaseStudySection title={t('caseStudy.ispring.toolsTitle')}>
        <CaseStudyTags tags={tList('caseStudy.ispring.tools')} />
      </CaseStudySection>

      <CaseStudySection title={t('caseStudy.ispring.tasksTitle')}>
        <CaseStudyList items={tList('caseStudy.ispring.tasks')} />
      </CaseStudySection>

      <CaseStudySection title={t('caseStudy.stack')}>
        <CaseStudyTags tags={ispringMeta?.tags ?? []} />
      </CaseStudySection>

      <CaseStudySection title={t('caseStudy.ispring.certificateTitle')}>
        <p className="copy-readable measure-readable">
          {t('caseStudy.ispring.certificateNote')}
        </p>
      </CaseStudySection>

      {GALLERY_SECTIONS.map((sectionKey, sectionIndex) => (
        <CaseStudySection key={sectionKey} title={t(`caseStudy.ispring.${sectionKey}`)}>
          <EvidenceGallery
            items={groups[sectionIndex] ?? []}
            allItems={ispringMedia}
            onOpen={setLightboxIndex}
            getAlt={(fileName) => t('caseStudy.evidenceAlt', { name: fileName })}
          />
        </CaseStudySection>
      ))}

      <CaseStudyNotice>{t('caseStudy.ispring.notice')}</CaseStudyNotice>

      <ImageLightbox
        images={lightboxImages}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndexChange={setLightboxIndex}
      />
    </CaseStudyShell>
  );
}
