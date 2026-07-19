import { useLocale } from '@/hooks';
import { projectsMeta } from '@/data/portfolio';
import {
  CaseStudyGallery,
  CaseStudyHeader,
  CaseStudyList,
  CaseStudyNotice,
  CaseStudyPlaceholder,
  CaseStudySection,
  CaseStudyShell,
  CaseStudyTags,
} from '@/components/case-study/CaseStudyLayout';

const sandboxMeta = projectsMeta.find((item) => item.id === 'door-sandbox');

export function SandboxCaseStudyPage() {
  const { t, tList } = useLocale();

  return (
    <CaseStudyShell>
      <CaseStudyHeader
        eyebrow={t('caseStudy.sandbox.eyebrow')}
        title={t('caseStudy.sandbox.title')}
        role={t('caseStudy.sandbox.role')}
        year={t('caseStudy.sandbox.year')}
      />

      <CaseStudySection title={t('caseStudy.sandbox.overviewTitle')}>
        <p className="max-w-3xl whitespace-pre-line text-base leading-relaxed text-fog">
          {t('caseStudy.sandbox.overview')}
        </p>
      </CaseStudySection>

      <CaseStudySection title={t('caseStudy.sandbox.architectureTitle')}>
        <CaseStudyList items={tList('caseStudy.sandbox.architecture')} />
      </CaseStudySection>

      <CaseStudySection title={t('caseStudy.sandbox.tasksTitle')}>
        <CaseStudyList items={tList('caseStudy.sandbox.tasks')} />
      </CaseStudySection>

      <CaseStudySection title={t('caseStudy.stack')}>
        <CaseStudyTags tags={sandboxMeta?.tags ?? []} />
      </CaseStudySection>

      <CaseStudySection title={t('caseStudy.sandbox.galleryTitle')}>
        <p className="mb-5 text-sm text-fog">{t('caseStudy.sandbox.galleryNote')}</p>
        <CaseStudyGallery count={4} label={t('caseStudy.placeholderMedia')} />
      </CaseStudySection>

      <CaseStudySection title={t('caseStudy.sandbox.videoTitle')}>
        <CaseStudyPlaceholder label={t('caseStudy.placeholderVideo')} className="min-h-[220px]" />
      </CaseStudySection>

      <CaseStudyNotice>{t('caseStudy.sandbox.notice')}</CaseStudyNotice>
    </CaseStudyShell>
  );
}
