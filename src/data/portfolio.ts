import type {
  CertificateMeta,
  ExperienceMeta,
  NavItem,
  ProfileMeta,
  ProjectMeta,
  RecommendationMeta,
  SkillCategoryMeta,
  SocialLink,
} from '@/types';
import certificateImage from '../../docs/certificates/certificates.jpg';
import avalonLetterPage1 from '../../docs/recommendations/Avalon.jpg';
import avalonLetterPage2 from '../../docs/recommendations/Avalon_1.jpg';
import meridiumLetter from '../../docs/recommendations/Meridium.jpg';

/**
 * Language-agnostic portfolio structure.
 * All user-facing copy lives in src/locales/{lang}/common.json
 */
export const profileMeta: ProfileMeta = {
  yearsExperience: 4,
  resumeUrl: '/resume/Anton_Fedotov_Resume.pdf',
  formEndpoint: undefined,
};

export const socialLinks: SocialLink[] = [
  { id: 'github', icon: 'github' },
  { id: 'hh', icon: 'hh' },
  { id: 'telegram', icon: 'telegram' },
];

export const navigation: NavItem[] = [
  { id: 'about' },
  { id: 'experience' },
  { id: 'skills' },
  { id: 'projects' },
  { id: 'certificates' },
  { id: 'recommendations' },
  { id: 'resume' },
  { id: 'contact' },
];

export const experienceMeta: ExperienceMeta[] = [
  {
    id: 'avalon',
    technologies: ['SolidWorks'],
  },
  {
    id: 'intecron',
    technologies: [],
  },
  {
    id: 'spas',
    technologies: [],
  },
  {
    id: 'kontakt',
    technologies: ['Solid Edge'],
  },
  {
    id: 'meridum',
    technologies: ['SolidWorks 2019', 'ToolBox', 'CupCat', 'Corel Draw'],
  },
];

export const skillsMeta: SkillCategoryMeta[] = [
  { id: 'engineering' },
  { id: 'backend', hasLearning: true, primarySkill: 'Python' },
  { id: 'qa', hasMethods: true },
];

export const projectsMeta: ProjectMeta[] = [
  {
    id: 'door-soft',
    year: '2026',
    tags: ['Python', 'REST API', 'PostgreSQL', 'Docker', 'Nginx'],
    featured: true,
    cta: {
      type: 'external',
      labelKey: 'openProject',
      projectKey: 'door-soft',
    },
  },
  {
    id: 'door-sandbox',
    year: '2026',
    tags: ['Python', 'REST API', 'Docker', 'PostgreSQL'],
    cta: {
      type: 'internal',
      labelKey: 'details',
      href: '/projects/sandbox',
    },
  },
  {
    id: 'ispring-lms',
    year: '2026',
    tags: ['Postman', 'Swagger', 'SQL', 'DevTools', 'Jira', 'Xray'],
    cta: {
      type: 'internal',
      labelKey: 'details',
      href: '/projects/ispring-testing',
    },
  },
];

/**
 * Certificates — add new entries here; cards render from this array.
 * Place images in docs/certificates/ and import above.
 */
export const certificatesMeta: CertificateMeta[] = [
  {
    id: 'ispring-qa',
    imageSrc: certificateImage,
    badges: [
      'QA Engineering',
      'Manual Testing',
      'API Testing',
      'Postman',
      'Swagger',
      'SQL',
      'DevTools',
    ],
  },
];

/**
 * Recommendation letters from real employers.
 * Multi-page letters: list pages in order — ImageLightbox enables ← → / swipe.
 */
export const recommendationsMeta: RecommendationMeta[] = [
  {
    id: 'avalon',
    images: [avalonLetterPage1, avalonLetterPage2],
  },
  {
    id: 'meridium',
    images: [meridiumLetter],
  },
];

